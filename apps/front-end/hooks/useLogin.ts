export function useLogin() {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;

  const gitHubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;

  const handleGithubLogin = () => {
    window.open(gitHubLoginUrl);
  };

  return { handleGithubLogin };
}
