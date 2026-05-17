'use client';
import { useEffect, useState, useCallback } from 'react';

interface Props {
  onFile: (file: File) => void;
}

export function GlobalDropZone({ onFile }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [depth, setDepth] = useState(0);

  const onDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer?.types.includes('Files')) {
      setDepth(d => d + 1);
      setIsDragging(true);
    }
  }, []);

  const onDragLeave = useCallback(() => {
    setDepth(d => {
      const next = d - 1;
      if (next <= 0) setIsDragging(false);
      return Math.max(0, next);
    });
  }, []);

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDepth(0);
    const file = e.dataTransfer?.files[0];
    if (file) onFile(file);
  }, [onFile]);

  useEffect(() => {
    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
  }, [onDragEnter, onDragLeave, onDragOver, onDrop]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      {/* Border frame */}
      <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-zinc-400/40" />
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" className="text-zinc-300">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="text-zinc-200 text-[15px] font-medium tracking-tight">Drop to open</p>
        <p className="text-zinc-500 text-[12px]">Release anywhere</p>
      </div>
    </div>
  );
}
