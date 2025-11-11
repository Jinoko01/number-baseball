'use server';

import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

interface CookieOptions {
  /**
   * 쿠키의 만료 일시를 설정
   * Date 객체나 타임스탬프(밀리초) 사용
   * @example
   * expires: new Date('2024-12-31')
   * expires: Date.now() + 24 * 60 * 60 * 1000  // 24시간 후
   */
  expires?: Date | number;

  /**
   * 쿠키가 유효한 상대적 시간(초)
   * @example
   * maxAge: 60 * 60  // 1시간
   * maxAge: 24 * 60 * 60  // 1일
   * maxAge: 30 * 24 * 60 * 60  // 30일
   */
  maxAge?: number;

  /**
   * 쿠키가 유효한 경로
   * @default "/"
   * @example
   * path: "/"  // 모든 경로에서 접근 가능
   * path: "/admin"  // /admin 경로에서만 접근 가능
   * path: "/shop/cart"  // /shop/cart 경로에서만 접근 가능
   */
  path?: string;

  /**
   * 쿠키가 유효한 도메인
   * @example
   * domain: "example.com"  // example.com과 그 서브도메인에서 접근 가능
   * domain: "api.example.com"  // api.example.com에서만 접근 가능
   */
  domain?: string;

  /**
   * HTTPS 전송 여부
   * - true: HTTPS 연결에서만 쿠키 전송
   * - false: HTTP에서도 쿠키 전송
   * @default true in production
   * @example
   * secure: true  // HTTPS에서만 쿠키 전송
   * secure: false  // HTTP에서도 쿠키 전송 (개발 환경)
   */
  secure?: boolean;

  /**
   * JavaScript에서의 쿠키 접근 제한
   * - true: document.cookie로 접근 불가 (보안 강화)
   * - false: document.cookie로 접근 가능
   * @default true
   * @example
   * httpOnly: true  // JavaScript에서 접근 불가
   * httpOnly: false  // JavaScript에서 접근 가능
   */
  httpOnly?: boolean;

  /**
   * 크로스 사이트 요청에 대한 쿠키 전송 정책
   * - "strict": 같은 사이트 요청에만 쿠키 전송
   * - "lax": 일부 크로스 사이트 요청에 쿠키 전송 허용 (기본값)
   * - "none": 모든 크로스 사이트 요청에 쿠키 전송 (secure: true 필요)
   * @default "lax"
   * @example
   * sameSite: "strict"  // 가장 엄격한 보안
   * sameSite: "lax"     // 적절한 보안과 사용성 균형
   * sameSite: "none"    // 크로스 사이트 요청 허용
   */
  sameSite?: 'lax' | 'strict' | 'none';
}

export async function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): Promise<void> {
  const defaultOptions: CookieOptions = {
    path: '/',
    maxAge: 24 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  const cookieOptions = { ...defaultOptions, ...options };
  const cookieStore = await cookies();
  cookieStore.set(name, value, cookieOptions);
}

export async function getCookie(name: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  const value = cookieStore.get(name)?.value;
  return value;
}

export async function getCookieFromRequest(
  req: NextRequest,
  name: string
): Promise<string | undefined> {
  const value = req.cookies.get(name)?.value;
  return value;
}

export async function deleteCookie(
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {}
): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete({ name, ...options });
  } catch (error) {
    console.error(`Error deleting cookie ${name}:`, error);
  }
}

export async function getAllCookies(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  return Object.fromEntries(cookieStore.getAll().map((cookie) => [cookie.name, cookie.value]));
}

export async function hasCookie(name: string): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(name);
}
