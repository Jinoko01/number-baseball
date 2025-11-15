import { Card, CardContent, CardHeader } from '../../../@workspace/ui/components/card';
import { User } from 'utils';
import Image from 'next/image';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const { nickname, avatar } = user;

  return (
    <Card className='bg-white shadow-xl'>
      <CardHeader className='text-center'>
        <Image src={avatar} alt={`${nickname}의 프로필 이미지`} width={52} height={52} />
      </CardHeader>
      <CardContent className='flex items-center justify-center'>
        <h3>{nickname}</h3>
      </CardContent>
    </Card>
  );
}
