'use client';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownViewer({ src }: { src: string }) {
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
    <div className="h-full overflow-auto px-4 sm:px-8 py-8">
      <article className="prose prose-invert prose-zinc prose-sm sm:prose-base max-w-3xl mx-auto">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content ?? ''}
        </ReactMarkdown>
      </article>
    </div>
  );
}
