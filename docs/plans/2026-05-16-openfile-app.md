# OpenFile App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Next.js file viewer website that opens PDF, CSV, JSON, HTML, MD, TXT, DOCX, images, Mermaid diagrams, and XLSX files — all client-side, responsive, deployable to Vercel.

**Architecture:** Next.js App Router, fully client-side (no API routes). Files loaded via drag & drop upload or URL fetch. Each format has a dedicated lazy-loaded viewer component.

**Tech Stack:** Next.js 14, Tailwind CSS, react-pdf, papaparse, react-markdown, mammoth, xlsx, mermaid, highlight.js, react-dropzone, lucide-react, clsx, tailwind-merge

---

### Task 1: Init Next.js project

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`

**Step 1: Create Next.js app**

```bash
cd /home/hades/may-2026/openfile/.worktrees/openfile-app
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

**Step 2: Install all dependencies**

```bash
npm install react-pdf papaparse react-markdown remark-gfm mammoth xlsx mermaid highlight.js react-dropzone lucide-react clsx tailwind-merge @tailwindcss/typography
npm install -D @types/papaparse
```

**Step 3: Verify dev server starts**

```bash
npm run dev &
sleep 5 && curl -s http://localhost:3000 | grep -q "Next" && echo "OK" || echo "FAIL"
kill %1
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: init Next.js project with dependencies"
```

---

### Task 2: File type detection utility

**Files:**
- Create: `lib/detectFileType.ts`

**Step 1: Write the file**

```typescript
// lib/detectFileType.ts
export type FileType =
  | 'pdf' | 'csv' | 'json' | 'html' | 'md' | 'txt'
  | 'docx' | 'image' | 'mermaid' | 'xlsx' | 'unknown';

const EXT_MAP: Record<string, FileType> = {
  pdf: 'pdf', csv: 'csv', json: 'json',
  html: 'html', htm: 'html',
  md: 'md', markdown: 'md',
  txt: 'txt',
  docx: 'docx',
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image',
  mmd: 'mermaid',
  xlsx: 'xlsx', xls: 'xlsx',
};

export function detectFileType(filename: string): FileType {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return EXT_MAP[ext] ?? 'unknown';
}
```

**Step 2: Commit**

```bash
git add lib/detectFileType.ts && git commit -m "feat: add file type detection utility"
```

---

### Task 3: Root layout with dark mode toggle

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/ThemeProvider.tsx`, `components/Header.tsx`

**Step 1: Create ThemeProvider**

```typescript
// components/ThemeProvider.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ dark: true, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**Step 2: Create Header**

```typescript
// components/Header.tsx
'use client';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import Link from 'next/link';

export function Header({ filename }: { filename?: string }) {
  const { dark, toggle } = useTheme();
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 dark:border-zinc-700">
      <Link href="/" className="text-lg font-semibold tracking-tight">OpenFile</Link>
      {filename && <span className="text-sm text-zinc-400 truncate max-w-xs">{filename}</span>}
      <button onClick={toggle} className="p-2 rounded hover:bg-zinc-800 transition">
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}
```

**Step 3: Update layout.tsx**

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OpenFile — View any file in your browser',
  description: 'Open PDF, CSV, JSON, HTML, Markdown, DOCX, images, and more — all in your browser.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 min-h-screen`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add layout with dark mode toggle"
```

---

### Task 4: Landing page (upload + URL input)

**Files:**
- Modify: `app/page.tsx`
- Create: `components/FileDropzone.tsx`, `components/UrlInput.tsx`

**Step 1: Create FileDropzone**

```typescript
// components/FileDropzone.tsx
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
```

**Step 2: Create UrlInput**

```typescript
// components/UrlInput.tsx
'use client';
import { useState } from 'react';
import { Link } from 'lucide-react';

export function UrlInput({ onUrl }: { onUrl: (url: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <div className="flex gap-2">
      <div className="flex-1 flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3">
        <Link size={16} className="text-zinc-500 shrink-0" />
        <input
          className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-zinc-600"
          placeholder="Paste a file URL..."
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && value && onUrl(value)}
        />
      </div>
      <button
        onClick={() => value && onUrl(value)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition"
      >
        Open
      </button>
    </div>
  );
}
```

**Step 3: Update app/page.tsx**

```typescript
// app/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { FileDropzone } from '@/components/FileDropzone';
import { UrlInput } from '@/components/UrlInput';
import { Header } from '@/components/Header';

export default function Home() {
  const router = useRouter();

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    router.push(`/view?src=${encodeURIComponent(url)}&name=${encodeURIComponent(file.name)}`);
  }

  function handleUrl(url: string) {
    const name = url.split('/').pop() ?? 'file';
    router.push(`/view?src=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}`);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-3xl font-bold mb-2 text-center">Open any file</h1>
        <p className="text-zinc-400 mb-10 text-center">PDF, CSV, JSON, Markdown, DOCX, images, and more</p>
        <div className="w-full max-w-lg space-y-4">
          <FileDropzone onFile={handleFile} />
          <div className="flex items-center gap-3 text-zinc-600 text-sm">
            <div className="flex-1 h-px bg-zinc-800" />or<div className="flex-1 h-px bg-zinc-800" />
          </div>
          <UrlInput onUrl={handleUrl} />
        </div>
      </main>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add landing page with dropzone and URL input"
```

---

### Task 5: Viewer page shell + FileViewer router

**Files:**
- Create: `app/view/page.tsx`, `components/FileViewer.tsx`

**Step 1: Create app/view/page.tsx**

```typescript
// app/view/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { FileViewer } from '@/components/FileViewer';

function ViewContent() {
  const params = useSearchParams();
  const src = params.get('src') ?? '';
  const name = params.get('name') ?? 'file';
  return (
    <div className="flex flex-col min-h-screen">
      <Header filename={name} />
      <main className="flex-1 overflow-auto">
        <FileViewer src={src} filename={name} />
      </main>
    </div>
  );
}

export default function ViewPage() {
  return <Suspense><ViewContent /></Suspense>;
}
```

**Step 2: Create FileViewer router**

```typescript
// components/FileViewer.tsx
'use client';
import dynamic from 'next/dynamic';
import { detectFileType } from '@/lib/detectFileType';

const viewers = {
  pdf:     dynamic(() => import('./viewers/PdfViewer'),      { ssr: false }),
  csv:     dynamic(() => import('./viewers/CsvViewer'),      { ssr: false }),
  json:    dynamic(() => import('./viewers/JsonViewer'),     { ssr: false }),
  html:    dynamic(() => import('./viewers/HtmlViewer'),     { ssr: false }),
  md:      dynamic(() => import('./viewers/MarkdownViewer'), { ssr: false }),
  txt:     dynamic(() => import('./viewers/TextViewer'),     { ssr: false }),
  docx:    dynamic(() => import('./viewers/DocxViewer'),     { ssr: false }),
  image:   dynamic(() => import('./viewers/ImageViewer'),    { ssr: false }),
  mermaid: dynamic(() => import('./viewers/MermaidViewer'),  { ssr: false }),
  xlsx:    dynamic(() => import('./viewers/XlsxViewer'),     { ssr: false }),
  unknown: dynamic(() => import('./viewers/TextViewer'),     { ssr: false }),
};

export function FileViewer({ src, filename }: { src: string; filename: string }) {
  const type = detectFileType(filename);
  const Viewer = viewers[type];
  return <Viewer src={src} filename={filename} />;
}
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add viewer page and FileViewer router"
```

---

### Task 6: PDF Viewer

**Files:**
- Create: `components/viewers/PdfViewer.tsx`

**Step 1: Write PdfViewer**

```typescript
// components/viewers/PdfViewer.tsx
'use client';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ src }: { src: string }) {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  return (
    <div className="flex flex-col items-center py-4 gap-4">
      <Document file={src} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        <Page pageNumber={page} className="shadow-xl" width={Math.min(window.innerWidth - 32, 800)} />
      </Document>
      {numPages > 1 && (
        <div className="flex items-center gap-4 text-sm">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-1 rounded hover:bg-zinc-800 disabled:opacity-30">
            <ChevronLeft size={20} />
          </button>
          <span>{page} / {numPages}</span>
          <button onClick={() => setPage(p => Math.min(numPages, p + 1))} disabled={page === numPages}
            className="p-1 rounded hover:bg-zinc-800 disabled:opacity-30">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add PDF viewer"
```

---

### Task 7: CSV Viewer

**Files:**
- Create: `components/viewers/CsvViewer.tsx`

**Step 1: Write CsvViewer**

```typescript
// components/viewers/CsvViewer.tsx
'use client';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export default function CsvViewer({ src }: { src: string }) {
  const [rows, setRows] = useState<string[][]>([]);

  useEffect(() => {
    fetch(src).then(r => r.text()).then(text => {
      const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
      setRows(result.data);
    });
  }, [src]);

  if (!rows.length) return <div className="p-8 text-zinc-400">Loading...</div>;
  const [header, ...body] = rows;

  return (
    <div className="overflow-auto p-4">
      <table className="text-sm border-collapse min-w-full">
        <thead>
          <tr>{header.map((h, i) => (
            <th key={i} className="px-3 py-2 text-left bg-zinc-800 border border-zinc-700 font-medium whitespace-nowrap">{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {body.map((row, i) => (
            <tr key={i} className="even:bg-zinc-900">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-1.5 border border-zinc-800 whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add CSV viewer"
```

---

### Task 8: JSON Viewer

**Files:**
- Create: `components/viewers/JsonViewer.tsx`

**Step 1: Write JsonViewer**

```typescript
// components/viewers/JsonViewer.tsx
'use client';
import { useEffect, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github-dark.css';

hljs.registerLanguage('json', json);

export default function JsonViewer({ src }: { src: string }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch(src).then(r => r.text()).then(text => {
      try {
        const pretty = JSON.stringify(JSON.parse(text), null, 2);
        setHtml(hljs.highlight(pretty, { language: 'json' }).value);
      } catch {
        setHtml(hljs.highlight(text, { language: 'json' }).value);
      }
    });
  }, [src]);

  return (
    <pre className="p-4 text-sm font-mono overflow-auto leading-relaxed">
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add JSON viewer"
```

---

### Task 9: HTML Viewer

**Files:**
- Create: `components/viewers/HtmlViewer.tsx`

**Step 1: Write HtmlViewer**

```typescript
// components/viewers/HtmlViewer.tsx
'use client';
export default function HtmlViewer({ src }: { src: string }) {
  return (
    <iframe
      src={src}
      className="w-full h-[calc(100vh-56px)] border-0"
      sandbox="allow-scripts allow-same-origin"
      title="HTML preview"
    />
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add HTML viewer"
```

---

### Task 10: Markdown Viewer

**Files:**
- Create: `components/viewers/MarkdownViewer.tsx`

**Step 1: Write MarkdownViewer**

```typescript
// components/viewers/MarkdownViewer.tsx
'use client';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownViewer({ src }: { src: string }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(src).then(r => r.text()).then(setContent);
  }, [src]);

  return (
    <div className="prose prose-invert prose-zinc max-w-3xl mx-auto px-4 py-8">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add Markdown viewer"
```

---

### Task 11: Text Viewer

**Files:**
- Create: `components/viewers/TextViewer.tsx`

**Step 1: Write TextViewer**

```typescript
// components/viewers/TextViewer.tsx
'use client';
import { useEffect, useState } from 'react';

export default function TextViewer({ src }: { src: string }) {
  const [text, setText] = useState('');

  useEffect(() => {
    fetch(src).then(r => r.text()).then(setText);
  }, [src]);

  return (
    <pre className="p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed overflow-auto">
      {text}
    </pre>
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add Text viewer"
```

---

### Task 12: DOCX Viewer

**Files:**
- Create: `components/viewers/DocxViewer.tsx`

**Step 1: Write DocxViewer**

```typescript
// components/viewers/DocxViewer.tsx
'use client';
import { useEffect, useState } from 'react';
import mammoth from 'mammoth';

export default function DocxViewer({ src }: { src: string }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch(src)
      .then(r => r.arrayBuffer())
      .then(buf => mammoth.convertToHtml({ arrayBuffer: buf }))
      .then(result => setHtml(result.value));
  }, [src]);

  return (
    <div
      className="prose prose-invert prose-zinc max-w-3xl mx-auto px-4 py-8"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add DOCX viewer"
```

---

### Task 13: Image Viewer

**Files:**
- Create: `components/viewers/ImageViewer.tsx`

**Step 1: Write ImageViewer**

```typescript
// components/viewers/ImageViewer.tsx
'use client';
export default function ImageViewer({ src, filename }: { src: string; filename: string }) {
  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-56px)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={filename} className="max-w-full max-h-[calc(100vh-100px)] object-contain rounded shadow-xl" />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add Image viewer"
```

---

### Task 14: Mermaid Viewer

**Files:**
- Create: `components/viewers/MermaidViewer.tsx`

**Step 1: Write MermaidViewer**

```typescript
// components/viewers/MermaidViewer.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'dark' });

export default function MermaidViewer({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(src).then(r => r.text()).then(async text => {
      try {
        const { svg } = await mermaid.render('mermaid-svg', text);
        if (ref.current) ref.current.innerHTML = svg;
      } catch (e) {
        setError(String(e));
      }
    });
  }, [src]);

  if (error) return <div className="p-8 text-red-400 text-sm">{error}</div>;
  return <div ref={ref} className="flex justify-center p-8" />;
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add Mermaid viewer"
```

---

### Task 15: XLSX Viewer

**Files:**
- Create: `components/viewers/XlsxViewer.tsx`

**Step 1: Write XlsxViewer**

```typescript
// components/viewers/XlsxViewer.tsx
'use client';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export default function XlsxViewer({ src }: { src: string }) {
  const [sheets, setSheets] = useState<{ name: string; rows: string[][] }[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch(src).then(r => r.arrayBuffer()).then(buf => {
      const wb = XLSX.read(buf, { type: 'array' });
      const parsed = wb.SheetNames.map(name => ({
        name,
        rows: XLSX.utils.sheet_to_json<string[]>(wb.Sheets[name], { header: 1 }),
      }));
      setSheets(parsed);
    });
  }, [src]);

  if (!sheets.length) return <div className="p-8 text-zinc-400">Loading...</div>;
  const { rows } = sheets[active];
  const [header, ...body] = rows;

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {sheets.length > 1 && (
        <div className="flex gap-1 px-4 pt-3 border-b border-zinc-800">
          {sheets.map((s, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`px-3 py-1.5 text-sm rounded-t ${i === active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}>
              {s.name}
            </button>
          ))}
        </div>
      )}
      <div className="overflow-auto flex-1 p-4">
        <table className="text-sm border-collapse min-w-full">
          <thead>
            <tr>{(header ?? []).map((h, i) => (
              <th key={i} className="px-3 py-2 text-left bg-zinc-800 border border-zinc-700 font-medium whitespace-nowrap">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {body.map((row, i) => (
              <tr key={i} className="even:bg-zinc-900">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-1.5 border border-zinc-800 whitespace-nowrap">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add XLSX viewer"
```

---

### Task 16: Final polish & Vercel config

**Files:**
- Create: `vercel.json`, update `next.config.ts`

**Step 1: Add vercel.json**

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" }
      ]
    }
  ]
}
```

**Step 2: Update next.config.ts**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
};

export default nextConfig;
```

**Step 3: Build and verify**

```bash
npm run build
echo "Build exit code: $?"
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Vercel config and static export"
```

---

### Task 17: Supported formats badge on landing page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add format badges below the URL input**

Add this below the `<UrlInput>` in `app/page.tsx`:

```typescript
<div className="flex flex-wrap gap-2 justify-center pt-4">
  {['PDF','CSV','JSON','HTML','MD','TXT','DOCX','IMG','MMD','XLSX'].map(f => (
    <span key={f} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400 font-mono">{f}</span>
  ))}
</div>
```

**Step 2: Commit**

```bash
git add app/page.tsx && git commit -m "feat: add format badges to landing page"
```
