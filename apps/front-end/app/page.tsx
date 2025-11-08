'use client';

import { useLogin } from '@/hooks/useLogin';

export default function Home() {
  const { handleGithubLogin } = useLogin();

  return (
    <div>
      <h1 className='bg-blue-50'>야구 게임</h1>
      <button onClick={handleGithubLogin}>깃허브 로그인 테스트</button>
    </div>
  );
}
