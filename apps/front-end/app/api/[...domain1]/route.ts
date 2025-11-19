import { API_BASE_URL } from '@/lib/constants/api';
import { NextRequest, NextResponse } from 'next/server';
import { fetchUtil } from '@/lib/utils/fetchUtil';
import { getHeaders } from '../getHeaders';
import { RemoveApiPath } from '../removeApiPath';
import { refreshToken } from '@/lib/actions/refreshToken';
import { setResponseTokenCookie } from '@/lib/utils/routeFuntions';

type FetchArgs = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: HeadersInit;
  body?: unknown;
};

function isUnauthorized(res: { [key: string]: unknown }) {
  return res.statusCode === 401;
}

export async function requestWithRefresh(args: FetchArgs) {
  const result = await fetchUtil(args);

  if (!isUnauthorized(result)) {
    return {
      body: result,
      newAccessToken: null,
      newRefreshToken: null,
    };
  }

  const refreshResult = await refreshToken();

  if (!refreshResult) {
    return {
      body: result,
      newAccessToken: null,
      newRefreshToken: null,
    };
  }

  const headers = getHeaders(refreshResult.accessToken);

  const retryResult = await fetchUtil({
    ...args,
    headers,
  });

  return {
    body: retryResult,
    newAccessToken: refreshResult.accessToken,
    newRefreshToken: refreshResult.refreshToken,
  };
}

export async function GET(req: NextRequest) {
  const path = RemoveApiPath(req.nextUrl.pathname);
  const search = req.nextUrl.search;
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : undefined;
  const headers = getHeaders(accessToken);

  const { body, newAccessToken, newRefreshToken } = await requestWithRefresh({
    url: `${API_BASE_URL}${path}${search}`,
    method: 'GET',
    headers: { ...headers },
  });

  const res = NextResponse.json(body);

  if (newAccessToken && newRefreshToken) {
    console.log(newAccessToken);
    setResponseTokenCookie(res, newAccessToken, newRefreshToken);
  }

  return res;
}

export async function POST(req: NextRequest) {
  const path = RemoveApiPath(req.nextUrl.pathname);
  const search = req.nextUrl.search;
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : undefined;
  const headers = getHeaders(accessToken);
  let bodyData = undefined;
  try {
    bodyData = await req.json();
  } catch (e) {
    bodyData = undefined;
  }

  const { body, newAccessToken, newRefreshToken } = await requestWithRefresh({
    url: `${API_BASE_URL}${path}${search}`,
    method: 'POST',
    headers: { ...headers },
    ...(bodyData !== undefined ? { body: bodyData } : {}),
  });

  const res = NextResponse.json(body);

  if (newAccessToken && newRefreshToken) {
    setResponseTokenCookie(res, newAccessToken, newRefreshToken);
  }

  return res;
}

export async function PUT(req: NextRequest) {
  const path = RemoveApiPath(req.nextUrl.pathname);
  const search = req.nextUrl.search;
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : undefined;
  const headers = getHeaders(accessToken);
  let bodyData = undefined;
  try {
    bodyData = await req.json();
  } catch (e) {
    bodyData = undefined;
  }

  const { body, newAccessToken, newRefreshToken } = await requestWithRefresh({
    url: `${API_BASE_URL}${path}${search}`,
    method: 'POST',
    headers: { ...headers },
    ...(bodyData !== undefined ? { body: bodyData } : {}),
  });

  const res = NextResponse.json(body);

  if (newAccessToken && newRefreshToken) {
    setResponseTokenCookie(res, newAccessToken, newRefreshToken);
  }

  return res;
}

export async function PATCH(req: NextRequest) {
  const path = RemoveApiPath(req.nextUrl.pathname);
  const search = req.nextUrl.search;
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : undefined;
  const headers = getHeaders(accessToken);
  let bodyData = undefined;
  try {
    bodyData = await req.json();
  } catch (e) {
    bodyData = undefined;
  }

  const { body, newAccessToken, newRefreshToken } = await requestWithRefresh({
    url: `${API_BASE_URL}${path}${search}`,
    method: 'POST',
    headers: { ...headers },
    ...(bodyData !== undefined ? { body: bodyData } : {}),
  });

  const res = NextResponse.json(body);

  if (newAccessToken && newRefreshToken) {
    setResponseTokenCookie(res, newAccessToken, newRefreshToken);
  }

  return res;
}

export async function DELETE(req: NextRequest) {
  const path = RemoveApiPath(req.nextUrl.pathname);
  const search = req.nextUrl.search;
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : undefined;
  const headers = getHeaders(accessToken);

  const { body, newAccessToken, newRefreshToken } = await requestWithRefresh({
    url: `${API_BASE_URL}${path}${search}`,
    method: 'DELETE',
    headers: { ...headers },
  });

  const res = NextResponse.json(body);

  if (newAccessToken && newRefreshToken) {
    setResponseTokenCookie(res, newAccessToken, newRefreshToken);
  }

  return res;
}
