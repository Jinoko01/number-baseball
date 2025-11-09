import { Header } from 'ui';

interface HomeLayoutInterface {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutInterface) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
