import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXTAUTH_URL ?? 'https://hitomazu-ai-lp.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'ひとまずAI-LP',
    template: '%s | ひとまずAI-LP',
  },
  description: 'AIがLPを自動生成。チャットで指示するだけでプロ品質のランディングページが完成。',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteUrl,
    siteName: 'ひとまずAI-LP',
    title: 'ひとまずAI-LP',
    description: 'AIがLPを自動生成。チャットで指示するだけでプロ品質のランディングページが完成。',
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ひとまずAI-LP',
    description: 'AIがLPを自動生成。チャットで指示するだけでプロ品質のランディングページが完成。',
    images: ['/og-image.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
