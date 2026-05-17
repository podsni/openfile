'use client';
import { useEffect, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github-dark.css';

hljs.registerLanguage('json', json);

export function JsonViewer({ src }: { src: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(src)
      .then(r => r.text())
      .then(text => {
        // Validate and pretty-print
        const parsed = JSON.parse(text);
        const pretty = JSON.stringify(parsed, null, 2);
        const result = hljs.highlight(pretty, { language: 'json' });
        setHtml(result.value);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [src]);

  if (loading) {
    return <div className="flex flex-1 items-center justify-center text-zinc-500">Loading…</div>;
  }

  if (error) {
    return <div className="flex flex-1 items-center justify-center text-red-400 p-8 text-center">Failed to parse JSON: {error}</div>;
  }

  return (
    <div className="h-full overflow-auto p-4 sm:p-8">
      <pre className="text-sm leading-relaxed">
        <code
          className="hljs language-json"
          dangerouslySetInnerHTML={{ __html: html ?? '' }}
        />
      </pre>
    </div>
  );
}
