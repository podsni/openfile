'use client';
import { detectFileType } from '@/lib/detectFileType';
import { PdfViewer } from '@/components/viewers/PdfViewer';

interface Props {
  src: string;
  name: string;
}

export function FileViewer({ src, name }: Props) {
  const type = detectFileType(name);

  switch (type) {
    case 'pdf':
      return <PdfViewer src={src} />;
    case 'image':
      return (
        <div className="flex items-center justify-center flex-1 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={name} className="max-w-full max-h-full object-contain rounded" />
        </div>
      );
    default:
      return (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-zinc-500">
          <p className="text-lg font-medium">No viewer for <span className="text-zinc-300">{type}</span> yet</p>
          <a
            href={src}
            download={name}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition"
          >
            Download file
          </a>
        </div>
      );
  }
}
