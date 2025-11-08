import Image from 'next/image';
import GithubLogo from '../assets/githubLogo.svg';

export function GithubLoginButton({ onClick }: { onClick: () => void }) {
  return (
    <button className='cursor-pointer p-2 border border-gray-400 rounded-lg' onClick={onClick}>
      <Image src={GithubLogo} alt='깃허브 로고' width={36} height={36} />
    </button>
  );
}
