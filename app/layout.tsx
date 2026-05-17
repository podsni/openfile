import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'OpenFile — View any file in your browser',
  description: 'Open PDF, CSV, JSON, HTML, Markdown, DOCX, images, and more — all in your browser.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-zinc-950 text-zinc-100 h-full overflow-hidden`}>
        <ThemeProvider>
          <div className="flex flex-col h-full">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
