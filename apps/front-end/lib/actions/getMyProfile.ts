'use server';

import { fetchUtil } from '@/lib/utils/fetchUtil';
import { API_ROUTE_URL } from '../constants/api';
import { getCookie } from '../utils/next-cookie';
import { getHeaders } from '@/app/api/getHeaders';

interface MyInfo {
  id: number;
  nickname: string;
  avatar: string;
}

export async function getMyProfile(): Promise<MyInfo> {
  const accessToken = await getCookie('accessToken');
  const headers = getHeaders(accessToken);

  const profile = await fetchUtil({
    url: `${API_ROUTE_URL}/users/me`,
    method: 'GET',
    headers,
  });

  return await profile;
}
