import { githubAuth } from '@/lib/apis/auth/githubAuth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  const tokens = await githubAuth({ code: code as string });

  const redirectUrl = new URL('/home', req.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });
  response.cookies.set('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
