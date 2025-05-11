"use client";

import type { Snippet } from '@/types';
import { SnippetCard } from '@/components/SnippetCard';
import { FileText } from 'lucide-react';

interface SnippetListProps {
  snippets: Snippet[];
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippetId: string) => void;
}

export function SnippetList({ snippets, onEdit, onDelete }: SnippetListProps) {
  if (snippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 border border-dashed rounded-lg bg-muted/50">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-muted-foreground">No Snippets Found</h2>
        <p className="text-muted-foreground">Try adding a new snippet or adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {snippets.map(snippet => (
        <SnippetCard key={snippet._id} snippet={snippet} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
