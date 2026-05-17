'use client';
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'dark' });

export function MermaidViewer({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(src)
      .then(r => r.text())
      .then(async text => {
        if (!containerRef.current) return;
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, text);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [src]);

  if (loading) {
    return <div className="flex flex-1 items-center justify-center text-zinc-500">Loading…</div>;
  }

  if (error) {
    return <div className="flex flex-1 items-center justify-center text-red-400 p-8 text-center">Failed to render diagram: {error}</div>;
  }

  return (
    <div className="flex h-full items-center justify-center overflow-auto p-8">
      <div ref={containerRef} className="max-w-full" />
    </div>
  );
}
