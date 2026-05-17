'use client';
import dynamic from 'next/dynamic';
import { detectFileType } from '@/lib/detectFileType';

const PdfViewer      = dynamic(() => import('./viewers/PdfViewer').then(m => ({ default: m.PdfViewer })),      { ssr: false });
const CsvViewer      = dynamic(() => import('./viewers/CsvViewer').then(m => ({ default: m.CsvViewer })),      { ssr: false });
const JsonViewer     = dynamic(() => import('./viewers/JsonViewer').then(m => ({ default: m.JsonViewer })),     { ssr: false });
const HtmlViewer     = dynamic(() => import('./viewers/HtmlViewer').then(m => ({ default: m.HtmlViewer })),    { ssr: false });
const MarkdownViewer = dynamic(() => import('./viewers/MarkdownViewer').then(m => ({ default: m.MarkdownViewer })), { ssr: false });
const TextViewer     = dynamic(() => import('./viewers/TextViewer').then(m => ({ default: m.TextViewer })),    { ssr: false });
const DocxViewer     = dynamic(() => import('./viewers/DocxViewer').then(m => ({ default: m.DocxViewer })),    { ssr: false });
const ImageViewer    = dynamic(() => import('./viewers/ImageViewer').then(m => ({ default: m.ImageViewer })),  { ssr: false });
const MermaidViewer  = dynamic(() => import('./viewers/MermaidViewer').then(m => ({ default: m.MermaidViewer })), { ssr: false });
const EpubViewer     = dynamic(() => import('./viewers/EpubViewer').then(m => ({ default: m.EpubViewer })),    { ssr: false });
const XlsxViewer     = dynamic(() => import('./viewers/XlsxViewer').then(m => ({ default: m.XlsxViewer })),   { ssr: false });

interface Props {
  src: string;
  name: string;
}

export function FileViewer({ src, name }: Props) {
  const type = detectFileType(name);

  switch (type) {
    case 'pdf':      return <PdfViewer src={src} />;
    case 'epub':     return <EpubViewer src={src} />;
    case 'csv':      return <CsvViewer src={src} />;
    case 'json':     return <JsonViewer src={src} />;
    case 'html':     return <HtmlViewer src={src} />;
    case 'md':       return <MarkdownViewer src={src} />;
    case 'txt':      return <TextViewer src={src} />;
    case 'docx':     return <DocxViewer src={src} />;
    case 'image':    return <ImageViewer src={src} name={name} />;
    case 'mermaid':  return <MermaidViewer src={src} />;
    case 'xlsx':     return <XlsxViewer src={src} />;
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
