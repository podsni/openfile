'use client';
export const dynamic = 'force-dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { TabBar } from '@/components/TabBar';
import { FileViewer } from '@/components/FileViewer';
import { TabsProvider, useTabs } from '@/components/TabsProvider';
import { FileText } from 'lucide-react';
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

  const activeTab = tabs.find(t => t.id === activeId);

  return (
    <div className="flex flex-col h-full">
      <TabBar />
      <div className="flex-1 overflow-hidden relative">
        {!activeTab ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-600">
            <FileText size={40} strokeWidth={1} />
            <p className="text-sm">No file open</p>
            <Link
              href="/"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition"
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
        <div className="flex flex-1 items-center justify-center text-zinc-500 text-sm">
          Loading…
        </div>
      }>
        <ViewerContent />
      </Suspense>
    </TabsProvider>
  );
}
