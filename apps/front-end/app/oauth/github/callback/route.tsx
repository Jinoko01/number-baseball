import { githubAuth } from '@/lib/apis/auth/githubAuth';
import { setResponseTokenCookie } from '@/lib/utils/routeFuntions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  const tokens = await githubAuth({ code: code as string });

  const redirectUrl = new URL('/home', req.url);
  const response = NextResponse.redirect(redirectUrl);

  setResponseTokenCookie(response, tokens.accessToken, tokens.refreshToken);

  return response;
}
