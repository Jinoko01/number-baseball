import fetchUtil from '../fetchUtil';

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export async function sendGithubCode(code: string) {
  const response = await fetchUtil({
    url: `${baseUrl}/user/github-info`,
    method: 'POST',
    body: { code },
  });

  return response;
}
