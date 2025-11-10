import fetchUtil from '../fetchUtil';

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export async function sendGithubCode(code: string) {
  const response = await fetchUtil({
    url: `${baseUrl}/auth/github`,
    method: 'POST',
    body: { code },
  });
  const user = response.user;

  return user;
}
