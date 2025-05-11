import type { LanguageOption } from '@/types';
import { FileJson, Braces, FileCode2, Database, Terminal, FileText, Code, Pilcrow } from 'lucide-react';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'javascript', label: 'JavaScript', icon: Braces },
  { value: 'python', label: 'Python', icon: Code },
  { value: 'typescript', label: 'TypeScript', icon: Braces },
  { value: 'java', label: 'Java', icon: Code },
  { value: 'html', label: 'HTML', icon: FileCode2 },
  { value: 'css', label: 'CSS', icon: FileCode2 },
  { value: 'sql', label: 'SQL', icon: Database },
  { value: 'json', label: 'JSON', icon: FileJson },
  { value: 'shell', label: 'Shell/Bash', icon: Terminal },
  { value: 'markdown', label: 'Markdown', icon: FileText },
  { value: 'text', label: 'Plain Text', icon: Pilcrow },
  { value: 'other', label: 'Other', icon: Code },
];
