import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { setResponseTokenCookie } from '@/lib/utils/routeFuntions';
import { refreshToken } from '@/lib/actions/refreshToken';

interface JwtPayload {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

export async function middleware(req: NextRequest) {
  const resCheckTokenExpired = await checkTokenExpired(req);

  if (resCheckTokenExpired) {
    return resCheckTokenExpired;
  }

  return NextResponse.next();
}

function isValidAccessToken(token: string): boolean {
  try {
    const decoded: JwtPayload | null = jwt.decode(token);
    if (!decoded) {
      console.error('유효한 토큰이 아닙니다.');
      return true;
    }

    const { exp } = decoded;

    const now = Date.now() / 1000;
    return now > exp;
  } catch (error) {
    console.error(error);
    return true;
  }
}

async function checkTokenExpired(req: NextRequest): Promise<NextResponse | null> {
  const accessToken = req.cookies.get('accessToken');
  const _refreshToken = req.cookies.get('refreshToken');

  if (accessToken && _refreshToken && isValidAccessToken(accessToken.value)) {
    try {
      const res = await refreshToken();
      if (res.status !== 200) {
        throw new Error('Invalid tokens');
      }
      const data = (await res.json()).data;
      req.cookies.set('accessToken', data.accessToken);
      req.cookies.set('refreshToken', data.refreshToken);

      const response = NextResponse.redirect(new URL(req.nextUrl.pathname, req.url));
      return setResponseTokenCookie(response, data.accessToken, data.refreshToken);
    } catch (err) {
      console.error(`[checkTokenExpired] 토큰 재발급 실패 ${err}`);
      const res = NextResponse.redirect(req.nextUrl.toString(), {
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
  matcher: ['/home', '/room/:path*'],
};
