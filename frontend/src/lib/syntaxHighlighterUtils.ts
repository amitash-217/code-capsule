
import type { LanguageOption } from '@/types';
import { LANGUAGE_OPTIONS } from '@/lib/constants';

export const mapLanguageForSyntaxHighlighter = (langValue: string | undefined): string => {
  if (!langValue) return 'plaintext';
  switch (langValue) {
    case 'html':
      return 'markup';
    case 'shell':
      return 'bash';
    case 'text':
    case 'other':
      return 'plaintext';
    // Java is typically supported directly by syntax highlighters as 'java'
    // So no special mapping is needed here beyond checking if it's known.
    default:
      // Check if it's a known language value from LANGUAGE_OPTIONS
      const knownLanguage = LANGUAGE_OPTIONS.find(opt => opt.value === langValue);
      return knownLanguage ? langValue : 'plaintext';
  }
};

