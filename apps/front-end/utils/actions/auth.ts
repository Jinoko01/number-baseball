'use server';

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export async function sendGithubCode(code: string) {
  const res = await fetch(`${baseUrl}/user/github-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  return res.json();
}
