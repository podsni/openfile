'use client';
export const dynamic = 'force-dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { FileViewer } from '@/components/FileViewer';

function ViewerContent() {
  const params = useSearchParams();
  const src = params.get('src') ?? '';
  const name = params.get('name') ?? 'file';

  if (!src) {
    return (
      <div className="flex flex-1 items-center justify-center text-zinc-500">
        No file specified.
      </div>
    );
  }

  return (
    <>
      <Header filename={name} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <FileViewer src={src} name={name} />
      </div>
    </>
  );
}

export default function ViewPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="flex flex-1 items-center justify-center text-zinc-500">Loading…</div>}>
        <ViewerContent />
      </Suspense>
    </div>
  );
}
