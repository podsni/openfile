'use client';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import Link from 'next/link';

export function Header({ filename }: { filename?: string }) {
  const { dark, toggle } = useTheme();
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 dark:border-zinc-700">
      <Link href="/" className="text-lg font-semibold tracking-tight">OpenFile</Link>
      {filename && <span className="text-sm text-zinc-400 truncate max-w-xs">{filename}</span>}
      <button onClick={toggle} className="p-2 rounded hover:bg-zinc-800 transition">
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}
