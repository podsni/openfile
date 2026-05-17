'use client';
export const dynamic = 'force-dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useCallback } from 'react';
import { TabBar } from '@/components/TabBar';
import { FileViewer } from '@/components/FileViewer';
import { TabsProvider, useTabs } from '@/components/TabsProvider';
import { GlobalDropZone } from '@/components/GlobalDropZone';
import Link from 'next/link';

function ViewerContent() {
  const params = useSearchParams();
  const src = params.get('src') ?? '';
  const name = params.get('name') ?? 'file';
  const { tabs, activeId, openTab } = useTabs();

  useEffect(() => {
    if (src) openTab(name, src);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, name]);

  const handleDroppedFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    openTab(file.name, url);
    // Do NOT router.replace here — that would trigger useEffect → openTab again (duplicate tab bug)
  }, [openTab]);

  const activeTab = tabs.find(t => t.id === activeId);

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e]">
      <GlobalDropZone onFile={handleDroppedFile} />
      <TabBar />
      <div className="flex-1 overflow-hidden relative">
        {!activeTab ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-700">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1" className="text-zinc-700">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p className="text-[13px] text-zinc-600">No file open</p>
            <Link
              href="/"
              className="text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-4"
            >
              Open a file
            </Link>
          </div>
        ) : (
          tabs.map(tab => (
            <div
              key={tab.id}
              className={`absolute inset-0 overflow-auto ${tab.id === activeId ? 'block' : 'hidden'}`}
            >
              <FileViewer src={tab.src} name={tab.name} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <TabsProvider>
      <Suspense fallback={
        <div className="flex flex-1 items-center justify-center text-zinc-600 text-[13px]">
          Loading…
        </div>
      }>
        <ViewerContent />
      </Suspense>
    </TabsProvider>
  );
}
