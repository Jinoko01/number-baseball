'use client';

export default function Home() {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;

  const gitHubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;

  const handleLogin = () => {
    window.open(gitHubLoginUrl);
  };

  return (
    <div>
      <h1>야구 게임</h1>
      <button onClick={handleLogin}>깃허브 로그인 테스트</button>
    </div>
  );
}
