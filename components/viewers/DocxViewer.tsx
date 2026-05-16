'use client';
import { useEffect, useState } from 'react';
import mammoth from 'mammoth';

export function DocxViewer({ src }: { src: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(src)
      .then(r => r.arrayBuffer())
      .then(buf => mammoth.convertToHtml({ arrayBuffer: buf }))
      .then(result => setHtml(result.value))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [src]);

  if (loading) {
    return <div className="flex flex-1 items-center justify-center text-zinc-500">Loading…</div>;
  }

  if (error) {
    return <div className="flex flex-1 items-center justify-center text-red-400 p-8 text-center">Failed to load DOCX: {error}</div>;
  }

  return (
    <div className="flex-1 overflow-auto px-4 py-6">
      <article
        className="prose prose-invert prose-zinc max-w-3xl mx-auto"
        dangerouslySetInnerHTML={{ __html: html ?? '' }}
      />
    </div>
  );
}
