'use client';

import Image from 'next/image';
import { useAuthStore } from 'utils';
import Logo from '../assets/logo.webp';
import defaultProfile from '../assets/defaultProfile.webp';

export function Header() {
  const { avatar, name } = useAuthStore();

  return (
    <header className='w-full flex justify-between items-center px-8 py-4 shadow-lg sticky top-0 bg-white'>
      <div className='flex items-center gap-4'>
        <Image src={Logo} alt='로고' width={60} height={60} />
        <h1 className='text-2xl font-bold'>숫자 야구 게임</h1>
      </div>
      <div className='flex items-center gap-2'>
        <Image src={avatar ?? defaultProfile} alt='profileImage' width={60} height={60} />
        <p className='font-semibold text-lg'>{name ?? 'Guest'}</p>
      </div>
    </header>
  );
}
