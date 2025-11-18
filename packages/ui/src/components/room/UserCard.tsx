import { User } from 'utils';
import Image from 'next/image';

const STYLE = {
  CARD: 'shadow-md aspect-square p-8 rounded-2xl border-blue-300 bg-linear-to-br from-white to-blue-50 border-3 flex flex-col gap-4 items-center justify-center w-[180px] h-[180px]',
  IMAGE: 'mx-auto rounded-full overflow-hidden border shadow-md width-[52px] height-[52px]',
  CONTENT: 'flex items-center justify-center',
  NAME: 'font-bold text-lg',
};

interface UserCardProps {
  user?: User;
}

function BlankUserCard() {
  return (
    <div className={STYLE.CARD}>
      <header>
        <div className={STYLE.IMAGE} />
      </header>
      <div className={STYLE.CONTENT}>
        <h3 className={STYLE.NAME}>비어있음</h3>
      </div>
    </div>
  );
}

export function UserCard({ user }: UserCardProps) {
  const { nickname, avatar } = user ?? {};

  if (!nickname || !avatar) {
    return <BlankUserCard />;
  }

  return (
    <div className={STYLE.CARD}>
      <header>
        <Image
          className={STYLE.IMAGE}
          src={avatar}
          alt={`${nickname}의 프로필 이미지`}
          width={52}
          height={52}
        />
      </header>
      <div className={STYLE.CONTENT}>
        <h3 className={STYLE.NAME}>{nickname}</h3>
      </div>
    </div>
  );
}
