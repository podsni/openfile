'use client';
import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export function PdfViewer({ src }: { src: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPage(1);
  }, []);

  const onLoadError = useCallback((err: Error) => {
    setError(err.message);
  }, []);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center text-red-400 p-8 text-center">
        Failed to load PDF: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center overflow-auto py-4 gap-4 px-2">
      <Document
        file={src}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        className="flex flex-col items-center"
      >
        <Page
          pageNumber={page}
          className="shadow-xl rounded"
          renderTextLayer
          renderAnnotationLayer
        />
      </Document>

      {numPages > 1 && (
        <div className="flex items-center gap-3 sticky bottom-4 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 shadow-lg">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-1 rounded hover:bg-zinc-700 disabled:opacity-30 transition"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-zinc-300 min-w-[80px] text-center">
            {page} / {numPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(numPages, p + 1))}
            disabled={page >= numPages}
            className="p-1 rounded hover:bg-zinc-700 disabled:opacity-30 transition"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
