import { NextRequest, NextResponse } from 'next/server';

type Tokens = { accessToken: string; refreshToken: string };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/github`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return NextResponse.json({ message: 'Token exchange failed', detail: text }, { status: 500 });
  }

  const tokens = (await res.json()) as Tokens;

  const redirectUrl = new URL('/home', req.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // 1h
  });
  response.cookies.set('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14, // 14d
  });

  return response;
}
