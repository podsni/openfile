'use client';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export function CsvViewer({ src }: { src: string }) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(src)
      .then(r => r.text())
      .then(text => {
        const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
        if (result.errors.length && !result.data.length) {
          setError(result.errors[0].message);
          return;
        }
        const [head, ...body] = result.data;
        setHeaders(head ?? []);
        setRows(body);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [src]);

  if (loading) {
    return <div className="flex flex-1 items-center justify-center text-zinc-500">Loading…</div>;
  }

  if (error) {
    return <div className="flex flex-1 items-center justify-center text-red-400 p-8 text-center">Failed to parse CSV: {error}</div>;
  }

  return (
    <div className="h-full overflow-auto p-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="sticky top-0 bg-zinc-900 z-10">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-semibold text-zinc-300 border-b border-zinc-700 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-zinc-800/50 transition-colors">
              {headers.map((_, ci) => (
                <td
                  key={ci}
                  className="px-3 py-1.5 text-zinc-300 border-b border-zinc-800 whitespace-nowrap max-w-xs truncate"
                >
                  {row[ci] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-zinc-600 text-xs mt-3">{rows.length} rows</p>
    </div>
  );
}
