'use client';
import { useState } from 'react';
import { Link } from 'lucide-react';

export function UrlInput({ onUrl }: { onUrl: (url: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <div className="flex gap-2">
      <div className="flex-1 flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3">
        <Link size={16} className="text-zinc-500 shrink-0" />
        <input
          className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-zinc-600"
          placeholder="Paste a file URL..."
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && value && onUrl(value)}
        />
      </div>
      <button
        onClick={() => value && onUrl(value)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition"
      >
        Open
      </button>
    </div>
  );
}
