'use client';

export function HtmlViewer({ src }: { src: string }) {
  return (
    <iframe
      src={src}
      className="flex-1 w-full border-0"
      sandbox="allow-scripts allow-same-origin"
      title="HTML preview"
    />
  );
}
