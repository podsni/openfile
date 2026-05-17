'use client';
import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';

export function FileDropzone({ onFile }: { onFile: (file: File) => void }) {
  const onDrop = useCallback((files: File[]) => {
    if (files[0]) onFile(files[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <div
      {...getRootProps()}
      className={`relative rounded-xl border cursor-pointer outline-none transition-all duration-300 overflow-hidden
        ${isDragActive
          ? 'border-zinc-400/40 bg-white/[0.04]'
          : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.03]'
        }`}
    >
      <input {...getInputProps()} />

      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex flex-col items-center justify-center py-10 px-6 gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
          ${isDragActive ? 'bg-white/10' : 'bg-white/[0.05]'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            className={`transition-colors duration-300 ${isDragActive ? 'text-zinc-200' : 'text-zinc-500'}`}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <div className="text-center">
          <p className={`text-[13px] font-medium transition-colors duration-300 ${isDragActive ? 'text-zinc-200' : 'text-zinc-400'}`}>
            {isDragActive ? 'Release to open' : 'Drop a file here'}
          </p>
          <p className="text-[12px] text-zinc-600 mt-0.5">
            {isDragActive ? '' : 'or click to browse'}
          </p>
        </div>
      </div>
    </div>
  );
}
