'use client';
import { detectFileType } from '@/lib/detectFileType';
import { PdfViewer } from '@/components/viewers/PdfViewer';
import { CsvViewer } from '@/components/viewers/CsvViewer';
import { JsonViewer } from '@/components/viewers/JsonViewer';
import { HtmlViewer } from '@/components/viewers/HtmlViewer';
import { MarkdownViewer } from '@/components/viewers/MarkdownViewer';
import { TextViewer } from '@/components/viewers/TextViewer';
import { DocxViewer } from '@/components/viewers/DocxViewer';
import { ImageViewer } from '@/components/viewers/ImageViewer';
import { MermaidViewer } from '@/components/viewers/MermaidViewer';
import { XlsxViewer } from '@/components/viewers/XlsxViewer';

interface Props {
  src: string;
  name: string;
}

export function FileViewer({ src, name }: Props) {
  const type = detectFileType(name);

  switch (type) {
    case 'pdf':
      return <PdfViewer src={src} />;
    case 'csv':
      return <CsvViewer src={src} />;
    case 'json':
      return <JsonViewer src={src} />;
    case 'html':
      return <HtmlViewer src={src} />;
    case 'md':
      return <MarkdownViewer src={src} />;
    case 'txt':
      return <TextViewer src={src} />;
    case 'docx':
      return <DocxViewer src={src} />;
    case 'image':
      return <ImageViewer src={src} name={name} />;
    case 'mermaid':
      return <MermaidViewer src={src} />;
    case 'xlsx':
      return <XlsxViewer src={src} />;
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
