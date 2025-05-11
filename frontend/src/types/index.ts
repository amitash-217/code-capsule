
import type { LucideIcon } from 'lucide-react';

export interface LanguageOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

export interface Snippet {
  id: string;
  title: string;
  code: string;
  description: string;
  language: string;
  tags: string[];
  createdAt: string; 
}

export type SnippetFormData = Omit<Snippet, 'id' | 'createdAt'>;
