import { API_BASE_URL } from '@/lib/constants/api';
import { NextRequest, NextResponse } from 'next/server';
import { fetchUtil } from 'utils';
import { getHeaders } from '../getHeaders';
import { RemoveApiPath } from '../removeApiPath';

export async function GET(req: NextRequest) {
  const path = RemoveApiPath(req.nextUrl.pathname);
  const search = req.nextUrl.search;
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : undefined;
  const headers = getHeaders(accessToken);

  const response = await fetchUtil({
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
    body = await req.json(); // body가 없으면 여기서 에러 → catch에서 undefined로 처리
  } catch (e) {
    body = undefined;
  }

  const response = await fetchUtil({
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

  const response = await fetchUtil({
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

  const response = await fetchUtil({
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

  const response = await fetchUtil({
    url: `${API_BASE_URL}${path}${search}`,
    method: 'DELETE',
    headers: { ...headers },
  });

  return NextResponse.json(response);
}
