'use client';

import { GithubLoginButton, Modal } from 'ui';
import Image from 'next/image';
import { useLogin } from 'utils';

export default function LoginModal() {
  const { handleGithubLogin } = useLogin();

  return (
    <div>
      <Modal
        header={
          <div className='flex flex-col items-center gap-2'>
            <Image src='/assets/logo.webp' alt='로고' width={100} height={100} />
            <h1 className='text-2xl font-bold'>숫자 야구 게임</h1>
          </div>
        }
        body={<div>친구와 함께 실시간 숫자 야구 대결을 즐겨보세요</div>}
        actions={
          <div className='flex flex-col items-center justify-center gap-1'>
            <p className='text-sm text-gray-600'>로그인 수단을 선택하세요.</p>
            <div className='flex justify-center gap-8'>
              <GithubLoginButton onClick={handleGithubLogin} />
            </div>
          </div>
        }
      />
    </div>
  );
}
