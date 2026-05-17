'use client';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { useCallback } from 'react';

export function FileDropzone({ onFile }: { onFile: (file: File) => void }) {
  const onDrop = useCallback((files: File[]) => {
    if (files[0]) onFile(files[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 outline-none
        ${isDragActive
          ? 'border-indigo-500 bg-indigo-950/20 scale-[1.01]'
          : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/40'
        }`}
    >
      <input {...getInputProps()} />
      <div className={`flex flex-col items-center gap-3 transition-transform duration-200 ${isDragActive ? 'scale-105' : ''}`}>
        <div className={`p-3 rounded-xl transition-colors ${isDragActive ? 'bg-indigo-500/20' : 'bg-zinc-800'}`}>
          {isDragActive
            ? <FileText size={28} className="text-indigo-400" />
            : <Upload size={28} className="text-zinc-400" />
          }
        </div>
        <div>
          <p className="text-zinc-200 font-medium text-sm sm:text-base">
            {isDragActive ? 'Drop to open' : 'Drop a file here'}
          </p>
          <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
            {isDragActive ? '' : 'or click to browse your device'}
          </p>
        </div>
      </div>
    </div>
  );
}
