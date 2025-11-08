import { sendGithubCode } from '@/utils/actions/auth';

interface GithubCallbackPageInterface {
  searchParams: Promise<{ code: string }>;
}

export default async function Callback({ searchParams }: GithubCallbackPageInterface) {
  const code = (await searchParams).code;

  const res = await sendGithubCode(code);
  console.log(res);

  return (
    <div>
      <h1>Callback</h1>
      <p>{code}</p>
    </div>
  );
}
