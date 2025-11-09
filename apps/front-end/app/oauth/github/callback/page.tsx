'use client';

import { sendGithubCode } from '@/utils/api/auth';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from 'utils';

export default function Callback() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const { setId, setAvatar, setName, setProvider } = useAuthStore();

  useEffect(() => {
    async function fetchUserData() {
      const res = sendGithubCode(code as unknown as string);
      console.log('응답', res);
    }

    fetchUserData();
  });

  return (
    <div>
      <h1>Callback</h1>
    </div>
  );
}
