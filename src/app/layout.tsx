import Navbar from '@/components/Navbar';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Akasa Foods',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} items-center flex flex-col`}>
        <Navbar />
          {children}
        <Toaster />
      </body>
    </html>
  );
}
