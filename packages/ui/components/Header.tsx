'use client';

import Image from 'next/image';
import { useAuthStore } from 'utils';
import Logo from '../assets/logo.webp';
import defaultProfile from '../assets/defaultProfile.webp';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function Header() {
  const { avatar, id } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      router.replace('/');
    }
  });

  return (
    <header className='w-full flex justify-between items-center px-8 py-2 shadow-lg sticky top-0 bg-white'>
      <div className='items-center gap-4 hidden sm:flex'>
        <Image src={Logo} alt='로고' width={60} height={60} />
        <h1 className='text-2xl font-bold'>숫자 야구 게임</h1>
      </div>
      <div className='flex items-center gap-2'>
        <div className='rounded-[50%] overflow-hidden border-2 border-black'>
          <Image src={avatar ?? defaultProfile} alt='profileImage' width={40} height={40} />
        </div>

        <p className='font-semibold text-lg'>{id ?? 'Guest'}</p>
      </div>
    </header>
  );
}
