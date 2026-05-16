'use client';
import { useRouter } from 'next/navigation';
import { FileDropzone } from '@/components/FileDropzone';
import { UrlInput } from '@/components/UrlInput';
import { Header } from '@/components/Header';

export default function Home() {
  const router = useRouter();

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    router.push(`/view?src=${encodeURIComponent(url)}&name=${encodeURIComponent(file.name)}`);
  }

  function handleUrl(url: string) {
    const name = url.split('/').pop() ?? 'file';
    router.push(`/view?src=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}`);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-3xl font-bold mb-2 text-center">Open any file</h1>
        <p className="text-zinc-400 mb-10 text-center">PDF, CSV, JSON, Markdown, DOCX, images, and more</p>
        <div className="w-full max-w-lg space-y-4">
          <FileDropzone onFile={handleFile} />
          <div className="flex items-center gap-3 text-zinc-600 text-sm">
            <div className="flex-1 h-px bg-zinc-800" />or<div className="flex-1 h-px bg-zinc-800" />
          </div>
          <UrlInput onUrl={handleUrl} />
        </div>
      </main>
    </div>
  );
}
