import Image from 'next/image';

interface HeaderInterface {
  logoUrl: string;
  defaultProfileUrl: string;
  nickname: string;
  avatar: string;
}

export function Header({ logoUrl, defaultProfileUrl, nickname, avatar }: HeaderInterface) {
  return (
    <header className='w-full flex justify-between items-center px-8 py-2 shadow-lg sticky top-0 bg-white bg-opacity-70 min-h-16 max-h-16 backdrop-blur-sm'>
      <div className='items-center gap-3 hidden sm:flex'>
        <Image src={logoUrl} alt='로고' width={52} height={52} />
        <h1 className='text-xl font-bold'>숫자 야구 게임</h1>
      </div>
      <div className='flex items-center gap-2'>
        <div className='rounded-[50%] overflow-hidden border-2 border-black'>
          <Image src={avatar ?? defaultProfileUrl} alt='profileImage' width={36} height={36} />
        </div>

        <p className='font-semibold text-lg'>{nickname ?? 'Guest'}</p>
      </div>
    </header>
  );
}
