import { API_ROUTE_URL } from '@/lib/constants/api';
import { fetchUtil } from 'utils';

export async function githubAuth({ code }: { code: string }) {
  return await fetchUtil({
    url: `${API_ROUTE_URL}/auth/github`,
    method: 'POST',
    body: { code },
  });
}
