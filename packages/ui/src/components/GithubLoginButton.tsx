import Image from 'next/image';

interface GithubLoginButtonProps {
  logoUrl: string;
  onClick: () => void;
}

export function GithubLoginButton({ logoUrl, onClick }: GithubLoginButtonProps) {
  return (
    <button className='cursor-pointer p-2 border border-gray-400 rounded-lg' onClick={onClick}>
      <Image src={logoUrl} alt='깃허브 로고' width={36} height={36} />
    </button>
  );
}
