'use client';
import { useRouter } from 'next/navigation';
import { FileDropzone } from '@/components/FileDropzone';
import { UrlInput } from '@/components/UrlInput';
import { ArrowUpRight } from 'lucide-react';

const FORMATS = [
  'PDF', 'CSV', 'JSON', 'Markdown', 'DOCX', 'XLSX', 'HTML', 'Images', 'Mermaid', 'TXT'
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
    <div className="flex flex-col flex-1 overflow-auto bg-[#0c0c0e]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-white/[0.06]">
        <span className="text-[13px] font-medium tracking-[0.12em] uppercase text-zinc-300 letter-spacing-widest">
          OpenFile
        </span>
        <a
          href="https://github.com/podsni/openfile"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-200 transition-colors duration-300"
        >
          GitHub <ArrowUpRight size={12} />
        </a>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-24">
        <div className="w-full max-w-[520px]">

          {/* Eyebrow */}
          <p className="text-[11px] tracking-[0.18em] uppercase text-zinc-600 mb-6 text-center">
            Browser-native file viewer
          </p>

          {/* Headline */}
          <h1 className="text-[2rem] sm:text-[2.5rem] font-semibold leading-[1.15] tracking-[-0.03em] text-zinc-100 text-center mb-4">
            Open any file,<br />
            <span className="text-zinc-500">instantly.</span>
          </h1>

          {/* Subline */}
          <p className="text-[14px] text-zinc-500 text-center leading-relaxed mb-10 max-w-[380px] mx-auto">
            No upload. No account. Everything stays in your browser.
          </p>

          {/* Upload zone */}
          <div className="space-y-3 mb-8">
            <FileDropzone onFile={handleFile} />
            <div className="flex items-center gap-3 text-zinc-700 text-[11px] tracking-widest uppercase">
              <div className="flex-1 h-px bg-white/[0.05]" />
              or
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>
            <UrlInput onUrl={handleUrl} />
          </div>

          {/* Format list */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
            {FORMATS.map(f => (
              <span
                key={f}
                className="text-[11px] text-zinc-600 tracking-wide"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-white/[0.04] text-center">
        <p className="text-[11px] text-zinc-700">
          All processing happens locally — your files never leave your device
        </p>
      </footer>
    </div>
  );
}
