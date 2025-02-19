import '@mantine/core/styles.css';
import './globals.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Inter, Merriweather } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather'
});

export const metadata = {
  title: 'AI-Generated Blog',
  description: 'A modern platform for AI-generated content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${inter.variable} ${merriweather.variable} font-sans`}>
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}