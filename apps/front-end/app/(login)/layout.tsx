import { getMyProfile } from '@/lib/actions/getMyProfile';
import { Header } from 'ui';

interface HomeLayoutInterface {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: HomeLayoutInterface) {
  const myProfile = await getMyProfile();

  return (
    <div>
      <Header
        logoUrl={'/assets/logo.webp'}
        defaultProfileUrl={'/assets/defaultProfile.webp'}
        nickname={myProfile.nickname}
        avatar={myProfile.avatar}
      />
      {children}
    </div>
  );
}
