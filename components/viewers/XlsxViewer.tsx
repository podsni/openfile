'use client';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

interface SheetData {
  name: string;
  headers: string[];
  rows: string[][];
}

export function XlsxViewer({ src }: { src: string }) {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(src)
      .then(r => r.arrayBuffer())
      .then(buf => {
        const workbook = XLSX.read(buf, { type: 'array' });
        const parsed: SheetData[] = workbook.SheetNames.map(name => {
          const ws = workbook.Sheets[name];
          const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: '' });
          const [head = [], ...body] = data;
          return { name, headers: head as string[], rows: body as string[][] };
        });
        setSheets(parsed);
        setActiveSheet(0);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [src]);

  if (loading) {
    return <div className="flex flex-1 items-center justify-center text-zinc-500">Loading…</div>;
  }

  if (error) {
    return <div className="flex flex-1 items-center justify-center text-red-400 p-8 text-center">Failed to load spreadsheet: {error}</div>;
  }

  const sheet = sheets[activeSheet];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {sheets.length > 1 && (
        <div className="flex gap-1 px-4 pt-3 border-b border-zinc-800 overflow-x-auto">
          {sheets.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSheet(i)}
              className={`px-3 py-1.5 text-sm rounded-t transition whitespace-nowrap ${
                i === activeSheet
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 overflow-auto p-4">
        {sheet && (
          <>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="sticky top-0 bg-zinc-900 z-10">
                  {sheet.headers.map((h, i) => (
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
                {sheet.rows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-zinc-800/50 transition-colors">
                    {sheet.headers.map((_, ci) => (
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
            <p className="text-zinc-600 text-xs mt-3">{sheet.rows.length} rows</p>
          </>
        )}
      </div>
    </div>
  );
}
