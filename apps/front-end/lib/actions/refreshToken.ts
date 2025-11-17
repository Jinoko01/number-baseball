import { fetchUtil } from 'utils';
import { API_BASE_URL } from '../constants/api';
import { getCookie } from '../utils/next-cookie';
import { getHeaders } from '@/app/api/getHeaders';

export async function refreshToken() {
  const refreshToken = await getCookie('refreshToken');
  const headers = getHeaders(refreshToken);

  const profile = await fetchUtil({
    url: `${API_BASE_URL}/auth/refresh`,
    method: 'GET',
    headers,
  });

  return profile;
}
