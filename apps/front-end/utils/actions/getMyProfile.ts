'use server';

import { fetchUtil } from 'utils';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function getMyProfile(accessToken: string) {
  const profile = await fetchUtil({
    url: `${baseUrl}/users/me`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await profile;
}
