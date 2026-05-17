'use client';
import { useEffect, useRef, useState } from 'react';

type TocItem = { label: string; href: string; subitems?: TocItem[] };

export function EpubViewer({ src }: { src: string }) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [showToc, setShowToc] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentHref, setCurrentHref] = useState('');
  const renditionRef = useRef<{ display: (href: string) => void; prev: () => void; next: () => void; destroy: () => void } | null>(null);
  const bookRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (!viewerRef.current) return;
    let cancelled = false;

    async function init() {
      try {
        // Dynamic import to avoid SSR issues
        const ePubModule = await import('epubjs');
        const ePub = ePubModule.default ?? ePubModule;
        if (cancelled) return;

        // For blob URLs, fetch as ArrayBuffer first
        let bookSrc: string | ArrayBuffer = src;
        if (src.startsWith('blob:') || src.startsWith('data:')) {
          const buf = await fetch(src).then(r => r.arrayBuffer());
          if (cancelled) return;
          bookSrc = buf;
        }

        const book = (ePub as (src: string | ArrayBuffer, opts?: object) => {
          ready: Promise<void>;
          navigation: { toc: { label: string; href: string; subitems?: unknown[] }[] };
          renderTo: (el: HTMLElement, opts: object) => {
            display: (href?: string) => Promise<void>;
            prev: () => void;
            next: () => void;
            destroy: () => void;
            themes: { default: (styles: object) => void };
            on: (event: string, cb: (loc: { start: { href: string } }) => void) => void;
          };
          destroy: () => void;
        })(bookSrc, { openAs: src.endsWith('.epub') ? 'epub' : undefined });

        bookRef.current = book;
        await book.ready;
        if (cancelled) return;

        // Extract TOC
        const navToc = book.navigation?.toc ?? [];
        if (navToc.length > 0) {
          setToc(navToc.map(item => ({ label: item.label?.trim() ?? '', href: item.href ?? '' })));
          setShowToc(true);
        }

        if (!viewerRef.current || cancelled) return;

        const rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          flow: 'scrolled-doc',
          manager: 'continuous',
          allowScriptedContent: false,
        });

        renditionRef.current = rendition;

        rendition.themes.default({
          body: {
            background: '#111113 !important',
            color: '#d4d4d8 !important',
            fontFamily: 'Georgia, "Times New Roman", serif !important',
            fontSize: '17px !important',
            lineHeight: '1.8 !important',
            maxWidth: '680px !important',
            margin: '0 auto !important',
            padding: '2rem 1.5rem !important',
          },
          'h1,h2,h3,h4,h5,h6': { color: '#f4f4f5 !important', lineHeight: '1.3 !important' },
          a: { color: '#818cf8 !important' },
          img: { maxWidth: '100% !important', height: 'auto !important' },
          p: { marginBottom: '1em !important' },
        });

        rendition.on('locationChanged', (loc: { start: { href: string } }) => {
          setCurrentHref(loc?.start?.href ?? '');
        });

        await rendition.display();
        if (cancelled) return;
        setLoading(false);
      } catch (e) {
        if (!cancelled) {
          console.error('EPUB load error:', e);
          setError(String(e));
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      try { renditionRef.current?.destroy(); } catch {}
      try { bookRef.current?.destroy(); } catch {}
      renditionRef.current = null;
      bookRef.current = null;
    };
  }, [src]);

  function navigateTo(href: string) {
    renditionRef.current?.display(href);
    setCurrentHref(href);
    if (window.innerWidth < 768) setShowToc(false);
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div className="space-y-2">
          <p className="text-red-400/80 text-sm">Failed to load EPUB</p>
          <p className="text-zinc-600 text-xs font-mono max-w-sm break-all">{error}</p>
        </div>
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
            <button onClick={() => setShowToc(false)} className="text-zinc-700 hover:text-zinc-400 transition-colors text-[11px]">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {toc.map((item, i) => (
              <button
                key={i}
                onClick={() => navigateTo(item.href)}
                className={`w-full text-left px-3 py-1.5 text-[11px] leading-snug transition-colors truncate
                  ${currentHref === item.href ? 'text-zinc-200 bg-white/[0.05]' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03]'}`}
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
          <button onClick={() => renditionRef.current?.prev()}
            className="px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-200 transition-colors">← Prev</button>
          <button onClick={() => renditionRef.current?.next()}
            className="px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-200 transition-colors">Next →</button>
        </div>

        {/* EPUB render area */}
        <div className="flex-1 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-sm z-10">
              Loading EPUB…
            </div>
          )}
          <div ref={viewerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
