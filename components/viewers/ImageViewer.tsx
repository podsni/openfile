'use client';

export function ImageViewer({ src, name }: { src: string; name: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-4 overflow-auto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className="max-w-full max-h-full object-contain rounded shadow-xl"
      />
    </div>
  );
}
