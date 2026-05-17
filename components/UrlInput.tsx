'use client';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export function UrlInput({ onUrl }: { onUrl: (url: string) => void }) {
  const [value, setValue] = useState('');

  function submit() {
    const trimmed = value.trim();
    if (trimmed) onUrl(trimmed);
  }

  return (
    <div className={`flex items-center gap-0 rounded-xl border overflow-hidden transition-all duration-300
      ${value ? 'border-white/[0.12]' : 'border-white/[0.07]'}
      focus-within:border-white/[0.18] bg-white/[0.02]`}>
      <input
        className="flex-1 bg-transparent px-4 py-3 text-[13px] text-zinc-300 outline-none placeholder:text-zinc-700"
        placeholder="https://example.com/file.pdf"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
      />
      <button
        onClick={submit}
        disabled={!value.trim()}
        className="flex items-center justify-center w-10 h-10 mr-1 rounded-lg transition-all duration-200
          disabled:opacity-20 disabled:cursor-not-allowed
          enabled:hover:bg-white/[0.08] enabled:active:scale-95 text-zinc-400 enabled:hover:text-zinc-200"
        aria-label="Open URL"
      >
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
