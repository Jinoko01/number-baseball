'use server';

import { fetchUtil } from 'utils';
import { API_ROUTE_URL } from '../constants/api';

export async function getMyProfile(accessToken: string) {
  const profile = await fetchUtil({
    url: `${API_ROUTE_URL}/users/me`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await profile;
}
