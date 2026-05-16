'use client';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useCallback } from 'react';

export function FileDropzone({ onFile }: { onFile: (file: File) => void }) {
  const onDrop = useCallback((files: File[]) => {
    if (files[0]) onFile(files[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition
        ${isDragActive ? 'border-indigo-500 bg-indigo-950/30' : 'border-zinc-700 hover:border-zinc-500'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto mb-3 text-zinc-400" size={36} />
      <p className="text-zinc-300 font-medium">Drop any file here</p>
      <p className="text-zinc-500 text-sm mt-1">or click to browse</p>
    </div>
  );
}
