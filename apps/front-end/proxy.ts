import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { setResponseTokenCookie } from '@/lib/utils/routeFuntions';
import { refreshToken } from '@/lib/actions/refreshToken';

export async function proxy(req: NextRequest) {
  const resCheckTokenExpired = await checkTokenExpired(req);

  if (req.nextUrl.pathname !== '/' && resCheckTokenExpired) {
    return resCheckTokenExpired;
  }

  if (req.nextUrl.pathname === '/') {
    const accessToken = req.cookies.get('accessToken')?.value;

    if (accessToken && !isValidAccessToken(accessToken)) {
      const url = new URL('/home', req.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

function isValidAccessToken(token: string): boolean {
  try {
    const decoded: JwtPayload | null = jwt.decode(token, { json: true });
    if (!decoded) {
      console.error('유효한 토큰이 아닙니다.');
      return true;
    }

    const { exp } = decoded;

    const now = Date.now() / 1000;
    return now > exp!;
  } catch (error) {
    console.error(error);
    return true;
  }
}

async function checkTokenExpired(req: NextRequest): Promise<NextResponse | null> {
  const accessToken = req.cookies.get('accessToken')?.value;
  const _refreshToken = req.cookies.get('refreshToken')?.value;

  if (accessToken && _refreshToken && isValidAccessToken(accessToken)) {
    try {
      const res = await refreshToken();

      const response = NextResponse.redirect(new URL(req.nextUrl.pathname, req.url));
      return setResponseTokenCookie(response, res.accessToken, res.refreshToken);
    } catch (err) {
      console.error(`[checkTokenExpired] 토큰 재발급 실패 ${err}`);
      const res = NextResponse.redirect(new URL('/', req.url), {
        status: 302,
      });
      res.cookies.delete('accessToken');
      res.cookies.delete('refreshToken');
      return res;
    }
  }
  return null;
}

export const config = {
  source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
  matcher: ['/', '/home', '/room/:path*'],
};
