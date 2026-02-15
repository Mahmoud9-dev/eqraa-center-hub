import type { Metadata } from 'next';
import { Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: 'إقراء',
  description: 'إقراء - لتحفيظ القرآن الكريم والعلوم الإسلامية',
  icons: {
    icon: 'https://storage.googleapis.com/gpt-engineer-file-uploads/dhcNpa1gKFZ3DksMksiwOawAugs2/uploads/1762129696531-quran.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${notoSansArabic.variable} font-arabic`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
