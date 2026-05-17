'use client';
import { useEffect, useRef, useState } from 'react';

type TocItem = { label: string; href: string };

export function EpubViewer({ src }: { src: string }) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [showToc, setShowToc] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentHref, setCurrentHref] = useState('');
  const bookRef = useRef<unknown>(null);
  const renditionRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const ePub = (await import('epubjs')).default;
        const book = ePub(src);
        bookRef.current = book;

        await book.ready;
        if (cancelled) return;

        // Extract TOC
        const nav = book.navigation;
        if (nav?.toc) {
          const items: TocItem[] = nav.toc.map((item: { label: string; href: string }) => ({
            label: item.label?.trim() ?? '',
            href: item.href ?? '',
          }));
          setToc(items);
          if (items.length > 0) setShowToc(true);
        }

        if (!viewerRef.current) return;
        const rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          flow: 'scrolled-doc',
          manager: 'continuous',
        });
        renditionRef.current = rendition;

        rendition.themes.default({
          body: {
            background: '#111113 !important',
            color: '#e4e4e7 !important',
            fontFamily: 'var(--font-inter), system-ui, sans-serif !important',
            fontSize: '16px !important',
            lineHeight: '1.75 !important',
            maxWidth: '680px !important',
            margin: '0 auto !important',
            padding: '2rem 1.5rem !important',
          },
          a: { color: '#818cf8 !important' },
          'h1,h2,h3,h4,h5,h6': { color: '#f4f4f5 !important' },
          img: { maxWidth: '100% !important', height: 'auto !important' },
        });

        rendition.on('locationChanged', (loc: { start: { href: string } }) => {
          setCurrentHref(loc?.start?.href ?? '');
        });

        await rendition.display();
        if (cancelled) return;
        setLoading(false);
      } catch (e) {
        if (!cancelled) setError(String(e));
      }
    }
    init();
    return () => {
      cancelled = true;
      if (renditionRef.current) {
        try { (renditionRef.current as { destroy: () => void }).destroy(); } catch {}
      }
      if (bookRef.current) {
        try { (bookRef.current as { destroy: () => void }).destroy(); } catch {}
      }
    };
  }, [src]);

  function navigateTo(href: string) {
    if (renditionRef.current) {
      (renditionRef.current as { display: (href: string) => void }).display(href);
      setCurrentHref(href);
    }
  }

  function prevPage() {
    if (renditionRef.current) (renditionRef.current as { prev: () => void }).prev();
  }

  function nextPage() {
    if (renditionRef.current) (renditionRef.current as { next: () => void }).next();
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-400/80 p-8 text-center text-sm">
        Failed to load EPUB: {error}
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden bg-[#111113]">
      {/* TOC sidebar */}
      {showToc && toc.length > 0 && (
        <div className="w-56 shrink-0 flex flex-col border-r border-white/[0.06] bg-[#0c0c0e] overflow-hidden">
          <div className="px-3 py-2.5 border-b border-white/[0.04] flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 tracking-widest uppercase">Contents</span>
            <button
              onClick={() => setShowToc(false)}
              className="text-zinc-700 hover:text-zinc-400 transition-colors text-[11px]"
            >✕</button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {toc.map((item, i) => (
              <button
                key={i}
                onClick={() => navigateTo(item.href)}
                className={`w-full text-left px-3 py-1.5 text-[11px] leading-snug transition-colors truncate
                  ${currentHref === item.href
                    ? 'text-zinc-200 bg-white/[0.05]'
                    : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03]'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main viewer */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] bg-[#0c0c0e]">
          {toc.length > 0 && (
            <button
              onClick={() => setShowToc(s => !s)}
              className={`px-2 py-1 rounded text-[11px] transition-colors ${showToc ? 'text-zinc-200 bg-white/[0.08]' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05]'}`}
              title="Table of contents"
            >☰</button>
          )}
          <div className="flex-1" />
          <button
            onClick={prevPage}
            className="px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-200 transition-colors"
          >← Prev</button>
          <button
            onClick={nextPage}
            className="px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-200 transition-colors"
          >Next →</button>
        </div>

        {/* EPUB render area */}
        <div className="flex-1 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-sm">
              Loading EPUB…
            </div>
          )}
          <div ref={viewerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
