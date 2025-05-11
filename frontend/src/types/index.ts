
import type { LucideIcon } from 'lucide-react';

export interface LanguageOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

export interface Snippet {
  _id: string;
  code: string;
  description: string;
  language: string;
  tags: string[];
  modified_at: string; 
}

export type SnippetFormData = Omit<Snippet, 'id' | 'createdAt'>;
