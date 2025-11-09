'use client';

import { sendGithubCode } from 'utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from 'utils';

export default function Callback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');
  const { setId, setAvatar, setName, setProvider } = useAuthStore();

  useEffect(() => {
    async function fetchUserData() {
      const user = await sendGithubCode(code as unknown as string);
      setId(user.id);
      setAvatar(user.avatar);
      setName(user.name);
      setProvider(user.provider);
    }

    fetchUserData();
    router.replace('/home');
  });

  return (
    <div>
      <h1>Callback</h1>
    </div>
  );
}
