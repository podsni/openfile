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
