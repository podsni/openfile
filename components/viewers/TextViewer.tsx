'use client';
import { useEffect, useState } from 'react';

export function TextViewer({ src }: { src: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(src)
      .then(r => r.text())
      .then(setContent)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [src]);

  if (loading) {
    return <div className="flex flex-1 items-center justify-center text-zinc-500">Loading…</div>;
  }

  if (error) {
    return <div className="flex flex-1 items-center justify-center text-red-400 p-8 text-center">Failed to load file: {error}</div>;
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <pre className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap break-words font-mono max-w-4xl mx-auto">
        {content}
      </pre>
    </div>
  );
}
