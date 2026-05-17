'use client';
import { useState } from 'react';
import { Link2, ArrowRight } from 'lucide-react';

export function UrlInput({ onUrl }: { onUrl: (url: string) => void }) {
  const [value, setValue] = useState('');

  function submit() {
    const trimmed = value.trim();
    if (trimmed) onUrl(trimmed);
  }

  return (
    <div className="flex gap-2">
      <div className={`flex-1 flex items-center gap-2 bg-zinc-900 border rounded-xl px-3 transition-colors
        ${value ? 'border-zinc-600' : 'border-zinc-700'} focus-within:border-indigo-500`}>
        <Link2 size={15} className="text-zinc-500 shrink-0" />
        <input
          className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-zinc-600 text-zinc-200"
          placeholder="https://example.com/file.pdf"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
        {value && (
          <button
            onClick={() => setValue('')}
            className="text-zinc-600 hover:text-zinc-400 transition text-xs px-1"
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>
      <button
        onClick={submit}
        disabled={!value.trim()}
        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition"
      >
        <span className="hidden sm:inline">Open</span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
