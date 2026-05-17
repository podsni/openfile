'use client';
import { useRouter } from 'next/navigation';
import { FileDropzone } from '@/components/FileDropzone';
import { UrlInput } from '@/components/UrlInput';
import { FileText, ExternalLink } from 'lucide-react';

const FORMATS = [
  { label: 'PDF', color: 'text-red-400 bg-red-950/40 border-red-900' },
  { label: 'CSV', color: 'text-green-400 bg-green-950/40 border-green-900' },
  { label: 'JSON', color: 'text-yellow-400 bg-yellow-950/40 border-yellow-900' },
  { label: 'Markdown', color: 'text-blue-400 bg-blue-950/40 border-blue-900' },
  { label: 'DOCX', color: 'text-indigo-400 bg-indigo-950/40 border-indigo-900' },
  { label: 'XLSX', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900' },
  { label: 'HTML', color: 'text-orange-400 bg-orange-950/40 border-orange-900' },
  { label: 'Images', color: 'text-pink-400 bg-pink-950/40 border-pink-900' },
  { label: 'Mermaid', color: 'text-purple-400 bg-purple-950/40 border-purple-900' },
  { label: 'TXT', color: 'text-zinc-400 bg-zinc-800/40 border-zinc-700' },
];

export default function Home() {
  const router = useRouter();

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    router.push(`/view?src=${encodeURIComponent(url)}&name=${encodeURIComponent(file.name)}`);
  }

  function handleUrl(url: string) {
    const name = decodeURIComponent(url.split('/').pop()?.split('?')[0] ?? 'file');
    router.push(`/view?src=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}`);
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-indigo-400" />
          <span className="font-semibold tracking-tight">OpenFile</span>
        </div>
        <a
          href="https://github.com/podsni/openfile"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-zinc-800 transition text-zinc-400 hover:text-zinc-200"
          aria-label="GitHub"
        >
          <ExternalLink size={18} />
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-xl">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
              Open any file
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              View files instantly in your browser — no upload, no account, no tracking
            </p>
          </div>

          {/* Format badges */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-8">
            {FORMATS.map(f => (
              <span
                key={f.label}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${f.color}`}
              >
                {f.label}
              </span>
            ))}
          </div>

          {/* Upload area */}
          <div className="space-y-3">
            <FileDropzone onFile={handleFile} />
            <div className="flex items-center gap-3 text-zinc-600 text-xs">
              <div className="flex-1 h-px bg-zinc-800" />
              <span>or paste a URL</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            <UrlInput onUrl={handleUrl} />
          </div>

          {/* Footer note */}
          <p className="text-center text-zinc-600 text-xs mt-6">
            All processing happens locally in your browser
          </p>
        </div>
      </main>
    </div>
  );
}
