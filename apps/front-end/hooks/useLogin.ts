'use client';

import { useRouter } from 'next/navigation';

export function useLogin() {
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;

  const gitHubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;

  const handleGithubLogin = () => {
    router.replace(gitHubLoginUrl);
  };

  return { handleGithubLogin };
}
