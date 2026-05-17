'use client';
import { useState } from 'react';

export function HtmlViewer({ src }: { src: string }) {
  const [mode, setMode] = useState<'preview' | 'source'>('preview');
  const [source, setSource] = useState<string | null>(null);
  const [loadingSource, setLoadingSource] = useState(false);

  async function showSource() {
    if (source === null) {
      setLoadingSource(true);
      try {
        const text = await fetch(src).then(r => r.text());
        setSource(text);
      } catch {
        setSource('Failed to load source.');
      } finally {
        setLoadingSource(false);
      }
    }
    setMode('source');
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="shrink-0 flex items-center gap-1 px-3 py-2 border-b border-white/[0.06] bg-[#0c0c0e]">
        <button
          onClick={() => setMode('preview')}
          className={`px-3 py-1 rounded text-[11px] transition-colors ${mode === 'preview' ? 'text-zinc-200 bg-white/[0.08]' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05]'}`}
        >
          Preview
        </button>
        <button
          onClick={showSource}
          className={`px-3 py-1 rounded text-[11px] transition-colors ${mode === 'source' ? 'text-zinc-200 bg-white/[0.08]' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05]'}`}
        >
          {loadingSource ? 'Loading…' : 'Source'}
        </button>
      </div>

      {/* Content */}
      {mode === 'preview' ? (
        <iframe
          src={src}
          className="flex-1 w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="HTML preview"
          style={{ minHeight: 0 }}
        />
      ) : (
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <pre className="text-[12px] leading-relaxed text-zinc-300 whitespace-pre-wrap break-words font-mono">
            {source ?? ''}
          </pre>
        </div>
      )}
    </div>
  );
}
