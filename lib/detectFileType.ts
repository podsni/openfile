export type FileType =
  | 'pdf' | 'epub' | 'csv' | 'json' | 'html' | 'md' | 'txt'
  | 'docx' | 'image' | 'mermaid' | 'xlsx' | 'unknown';

const EXT_MAP: Record<string, FileType> = {
  pdf: 'pdf', epub: 'epub',
  csv: 'csv', json: 'json',
  html: 'html', htm: 'html',
  md: 'md', markdown: 'md',
  txt: 'txt',
  docx: 'docx',
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image',
  mmd: 'mermaid',
  xlsx: 'xlsx', xls: 'xlsx',
};

export function detectFileType(filename: string): FileType {
  // Strip query string and hash before extracting extension
  const clean = filename.split('?')[0].split('#')[0];
  const ext = clean.split('.').pop()?.toLowerCase() ?? '';
  return EXT_MAP[ext] ?? 'unknown';
}
