import type { Metadata } from 'next';
import { Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: 'إقراء',
  description: 'إقراء - لتحفيظ القرآن الكريم والعلوم الإسلامية',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var lang=localStorage.getItem('eqraa-language');if(lang==='en'||lang==='ar'){document.documentElement.setAttribute('lang',lang);document.documentElement.setAttribute('dir',lang==='ar'?'rtl':'ltr');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${notoSansArabic.variable} font-arabic`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
