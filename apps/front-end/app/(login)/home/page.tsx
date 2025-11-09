'use client';
import { useAuthStore } from 'utils';

export default function Home() {
  const { id, avatar, name, provider } = useAuthStore();

  return (
    <div>
      <h1>메인 페이지</h1>
      <p>{id}</p>
      <p>{avatar}</p>
      <p>{name}</p>
      <p>{provider}</p>
    </div>
  );
}
