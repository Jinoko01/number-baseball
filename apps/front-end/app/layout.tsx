import type { Metadata } from 'next';
import './global.css';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: '숫자 야구 대결',
  description: '온라인 숫자 야구 대결 플랫폼입니다.',
  openGraph: {
    title: '숫자 야구 대결',
    description: '온라인 숫자 야구 대결 플랫폼입니다.',
    images: ['/assets/thumbnail.png'],
  },
};

const pretendard = localFont({
  src: [
    {
      path: '../public/assets/font/Pretendard-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/assets/font/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/assets/font/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/assets/font/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/assets/font/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});

interface RootLayoutProps {
  children: React.ReactNode;
  loginModal: React.ReactNode;
}

export default function RootLayout({ children, loginModal }: Readonly<RootLayoutProps>) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/assets/logo.webp' sizes='any' />
      </head>
      <body className={`${pretendard.variable} antialiased`}>
        {loginModal}
        {children}
      </body>
    </html>
  );
}
