'use client';
import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export function PdfViewer({ src }: { src: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    function measure() {
      setWidth(Math.min(window.innerWidth - 32, 860));
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPage(1);
  }, []);

  const onLoadError = useCallback((err: Error) => {
    setError(err.message);
  }, []);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-400/80 p-8 text-center text-sm">
        Failed to load PDF: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#111113]">
      {/* PDF scroll area */}
      <div className="flex-1 overflow-auto flex flex-col items-center py-6 gap-3 px-4">
        <Document
          file={src}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={
            <div className="flex items-center justify-center py-20 text-zinc-600 text-sm">
              Loading PDF…
            </div>
          }
        >
          {/* Render all pages */}
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i + 1} className="relative">
              <Page
                pageNumber={i + 1}
                width={width}
                className="shadow-2xl"
                renderTextLayer
                renderAnnotationLayer
              />
              {/* Page number badge */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white/50 text-[10px] px-1.5 py-0.5 rounded font-mono">
                {i + 1}
              </div>
            </div>
          ))}
        </Document>
      </div>

      {/* Bottom bar */}
      {numPages > 0 && (
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-white/[0.06] bg-[#0c0c0e]">
          <span className="text-[11px] text-zinc-600 font-mono">
            {numPages} {numPages === 1 ? 'page' : 'pages'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-200 disabled:opacity-20 transition-colors"
              aria-label="Previous page"
            >
              ← Prev
            </button>
            <span className="text-[11px] text-zinc-500 font-mono min-w-[60px] text-center">
              {page} / {numPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(numPages, p + 1))}
              disabled={page >= numPages}
              className="px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-200 disabled:opacity-20 transition-colors"
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
