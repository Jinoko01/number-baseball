import { NextResponse } from 'next/server';

export const setResponseCookie = (response: NextResponse, name: string, value: string) => {
  response.cookies.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14일
  });

  return response;
};

export const setResponseTokenCookie = (
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) => {
  setResponseCookie(response, 'accessToken', accessToken);
  setResponseCookie(response, 'refreshToken', refreshToken);

  return response;
};
