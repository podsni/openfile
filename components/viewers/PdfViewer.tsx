'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

type TocItem = { title: string; pageNumber: number; level: number };

const BUFFER = 2; // pages to render above/below viewport

export function PdfViewer({ src }: { src: string }) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState(700);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [showToc, setShowToc] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<{ data: ArrayBuffer } | string | null>(null);
  const [visibleRange, setVisibleRange] = useState<[number, number]>([1, 5]);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load blob URLs as ArrayBuffer
  useEffect(() => {
    if (!src) return;
    if (src.startsWith('blob:') || src.startsWith('data:')) {
      fetch(src)
        .then(r => r.arrayBuffer())
        .then(buf => setPdfData({ data: buf }))
        .catch(e => setError(e.message));
    } else {
      setPdfData(src);
    }
  }, [src]);

  // Measure container width
  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setContainerWidth(Math.max(300, w - 32));
      }
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [showToc]);

  // Virtual rendering: track which pages are visible
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || numPages === 0) return;

    function onScroll() {
      const scrollTop = el!.scrollTop;
      const viewH = el!.clientHeight;

      let firstVisible = 1;
      let lastVisible = 1;
      let foundFirst = false;

      pageRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const top = ref.offsetTop;
        const bottom = top + ref.offsetHeight;
        if (bottom > scrollTop && top < scrollTop + viewH) {
          if (!foundFirst) { firstVisible = i + 1; foundFirst = true; }
          lastVisible = i + 1;
        }
      });

      setCurrentPage(firstVisible);
      setVisibleRange([
        Math.max(1, firstVisible - BUFFER),
        Math.min(numPages, lastVisible + BUFFER),
      ]);
    }

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [numPages]);

  const onLoadSuccess = useCallback(async (doc: pdfjs.PDFDocumentProxy) => {
    setNumPages(doc.numPages);
    setCurrentPage(1);
    setVisibleRange([1, Math.min(doc.numPages, 5)]);

    try {
      const outline = await doc.getOutline();
      if (outline) {
        const items: TocItem[] = [];
        async function walk(nodes: { title: string; dest: unknown; items?: unknown[] }[], level: number) {
          for (const node of nodes) {
            let pageNumber = 1;
            try {
              if (node.dest) {
                const dest = typeof node.dest === 'string'
                  ? await doc.getDestination(node.dest)
                  : node.dest as unknown[];
                if (dest) {
                  pageNumber = await doc.getPageIndex((dest as unknown[])[0] as { num: number; gen: number }) + 1;
                }
              }
            } catch {}
            items.push({ title: node.title, pageNumber, level });
            if (node.items?.length) await walk(node.items as { title: string; dest: unknown; items?: unknown[] }[], level + 1);
          }
        }
        await walk(outline as { title: string; dest: unknown; items?: unknown[] }[], 0);
        setToc(items);
        if (items.length > 0) setShowToc(true);
      }
    } catch {}
  }, []);

  function scrollToPage(n: number) {
    const ref = pageRefs.current[n - 1];
    if (ref && scrollRef.current) {
      scrollRef.current.scrollTo({ top: ref.offsetTop - 12, behavior: 'smooth' });
    }
    setCurrentPage(n);
  }

  const pageWidth = Math.round(containerWidth * scale);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-400/80 p-8 text-center text-sm">
        Failed to load PDF: {error}
      </div>
    );
  }

  if (!pdfData) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-600 text-sm">
        Loading PDF…
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden bg-[#111113]" ref={containerRef}>
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
                onClick={() => scrollToPage(item.pageNumber)}
                className={`w-full text-left py-1.5 text-[11px] leading-snug transition-colors truncate
                  ${currentPage === item.pageNumber ? 'text-zinc-200 bg-white/[0.05]' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03]'}`}
                style={{ paddingLeft: `${12 + item.level * 10}px`, paddingRight: '12px' }}
              >
                {item.title}
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
          <button onClick={() => scrollToPage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1}
            className="px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-200 disabled:opacity-20 transition-colors">← Prev</button>
          <span className="text-[11px] text-zinc-500 font-mono min-w-[70px] text-center">
            {currentPage} / {numPages || '…'}
          </span>
          <button onClick={() => scrollToPage(Math.min(numPages, currentPage + 1))} disabled={currentPage >= numPages}
            className="px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-200 disabled:opacity-20 transition-colors">Next →</button>
          <div className="w-px h-4 bg-white/[0.08] mx-1" />
          <button onClick={() => setScale(s => Math.max(0.5, +(s - 0.1).toFixed(1)))}
            className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] rounded transition-colors text-sm" title="Zoom out">−</button>
          <span className="text-[11px] text-zinc-500 font-mono w-10 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(3, +(s + 0.1).toFixed(1)))}
            className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] rounded transition-colors text-sm" title="Zoom in">+</button>
          <button onClick={() => setScale(1.0)}
            className="px-1.5 py-0.5 text-[10px] text-zinc-700 hover:text-zinc-400 hover:bg-white/[0.05] rounded transition-colors" title="Reset zoom">Reset</button>
        </div>

        {/* PDF scroll area */}
        <div ref={scrollRef} className="flex-1 overflow-auto">
          <div className="flex flex-col items-center py-6 gap-3 px-4">
            <Document
              file={pdfData}
              onLoadSuccess={onLoadSuccess}
              onLoadError={e => setError(e.message)}
              loading={null}
            >
              {Array.from({ length: numPages }, (_, i) => {
                const pageNum = i + 1;
                const inRange = pageNum >= visibleRange[0] && pageNum <= visibleRange[1];
                // Estimated page height for placeholder
                const estHeight = Math.round(pageWidth * 1.414);
                return (
                  <div
                    key={pageNum}
                    ref={el => { pageRefs.current[i] = el; }}
                    className="relative shadow-2xl bg-white"
                    style={{ width: pageWidth, minHeight: inRange ? undefined : estHeight }}
                  >
                    {inRange ? (
                      <>
                        <Page
                          pageNumber={pageNum}
                          width={pageWidth}
                          renderTextLayer
                          renderAnnotationLayer
                          error={<div className="flex items-center justify-center h-32 text-zinc-500 text-xs">Page {pageNum} failed</div>}
                        />
                        <div className="absolute bottom-2 right-2 bg-black/40 text-white/40 text-[10px] px-1.5 py-0.5 rounded font-mono select-none">
                          {pageNum}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center text-zinc-700 text-[10px] font-mono" style={{ height: estHeight }}>
                        {pageNum}
                      </div>
                    )}
                  </div>
                );
              })}
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
}
