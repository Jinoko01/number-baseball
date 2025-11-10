import { getMyProfile } from '@/utils/actions/getMyProfile';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Header } from 'ui';

interface HomeLayoutInterface {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: HomeLayoutInterface) {
  const cookie = await cookies();
  const accessToken = cookie.get('accessToken')?.value;

  if (!accessToken) {
    return redirect('/');
  }

  const myProfile = await getMyProfile(accessToken);

  return (
    <div>
      <Header nickname={myProfile.nickname} avatar={myProfile.avatar} />
      {children}
    </div>
  );
}
