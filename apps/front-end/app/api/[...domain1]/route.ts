import { API_BASE_URL } from '@/lib/constants/api';
import { NextRequest, NextResponse } from 'next/server';
import { fetchUtil } from 'utils';
import { getHeaders } from '../getHeaders';
import { RemoveApiPath } from '../removeApiPath';
import { refreshToken } from '@/lib/actions/refreshToken';

type FetchArgs = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: HeadersInit;
  body?: unknown;
};

function isUnauthorized(res: NextResponse) {
  return res?.status === 401;
}

export async function requestWithRefresh(args: FetchArgs) {
  const result = await fetchUtil(args);

  if (!isUnauthorized(result)) {
    return result;
  }

  try {
    const refreshResult = await refreshToken();

    if (!refreshResult) {
      return result;
    }
  } catch (e) {
    console.error('refreshToken 실패:', e);
    return result;
  }

  const retryResult = await fetchUtil(args);
  return retryResult;
}

export async function GET(req: NextRequest) {
  const path = RemoveApiPath(req.nextUrl.pathname);
  const search = req.nextUrl.search;
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : undefined;
  const headers = getHeaders(accessToken);

  const response = await requestWithRefresh({
    url: `${API_BASE_URL}${path}${search}`,
    method: 'GET',
    headers: { ...headers },
  });

  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  const path = RemoveApiPath(req.nextUrl.pathname);
  const search = req.nextUrl.search;
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : undefined;
  const headers = getHeaders(accessToken);
  let body = undefined;
  try {
    body = await req.json();
  } catch (e) {
    body = undefined;
  }

  const response = await requestWithRefresh({
    url: `${API_BASE_URL}${path}${search}`,
    method: 'POST',
    headers: { ...headers },
    ...(body !== undefined ? { body } : {}),
  });

  return NextResponse.json(response);
}

export async function PUT(req: NextRequest) {
  const path = RemoveApiPath(req.nextUrl.pathname);
  const search = req.nextUrl.search;
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : undefined;
  const headers = getHeaders(accessToken);
  const body = await req.json();

  const response = await requestWithRefresh({
    url: `${API_BASE_URL}${path}${search}`,
    method: 'PUT',
    headers: { ...headers },
    body,
  });

  return NextResponse.json(response);
}

export async function PATCH(req: NextRequest) {
  const path = RemoveApiPath(req.nextUrl.pathname);
  const search = req.nextUrl.search;
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : undefined;
  const headers = getHeaders(accessToken);
  const body = await req.json();

  const response = await requestWithRefresh({
    url: `${API_BASE_URL}${path}${search}`,
    method: 'PATCH',
    headers: { ...headers },
    body,
  });

  return NextResponse.json(response);
}

export async function DELETE(req: NextRequest) {
  const path = RemoveApiPath(req.nextUrl.pathname);
  const search = req.nextUrl.search;
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : undefined;
  const headers = getHeaders(accessToken);

  const response = await requestWithRefresh({
    url: `${API_BASE_URL}${path}${search}`,
    method: 'DELETE',
    headers: { ...headers },
  });

  return NextResponse.json(response);
}
