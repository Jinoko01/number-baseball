import { getMyProfile } from '@/lib/actions/getMyProfile';
import { getCookie } from '@/lib/utils/next-cookie';
import { redirect } from 'next/navigation';
import { Header } from 'ui';

interface HomeLayoutInterface {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: HomeLayoutInterface) {
  const accessToken = await getCookie('accessToken');

  if (!accessToken) {
    return redirect('/');
  }

  const myProfile = await getMyProfile(accessToken);
  console.log(myProfile);

  return (
    <div>
      <Header nickname={myProfile.nickname} avatar={myProfile.avatar} />
      {children}
    </div>
  );
}
