
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { SnippetList } from '@/components/SnippetList';
import { SnippetForm } from '@/components/SnippetForm';
import { TagFilter } from '@/components/TagFilter';
import type { Snippet, SnippetFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Code2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';

const initialSnippets: Snippet[] = [
  {
    id: '1',
    code: "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}",
    description: "Basic example of using the useState hook in React for a simple counter.",
    language: "javascript",
    tags: ["react", "hooks", "javascript", "frontend"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: '2',
    code: "squares = [x**2 for x in range(10)]\nprint(squares)",
    description: "A concise way to create lists in Python using list comprehension.",
    language: "python",
    tags: ["python", "list comprehension", "data structures"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
  {
    id: '3',
    code: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}",
    description: "Common CSS pattern to center an element within its parent using Flexbox.",
    language: "css",
    tags: ["css", "flexbox", "layout", "frontend"],
    createdAt: new Date().toISOString(),
  },
];


export default function HomePage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [snippetToDeleteId, setSnippetToDeleteId] = useState<string | null>(null);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const storedSnippets = localStorage.getItem('codeCapsuleSnippets');
    if (storedSnippets) {
      setSnippets(JSON.parse(storedSnippets));
    } else {
      setSnippets(initialSnippets);
      localStorage.setItem('codeCapsuleSnippets', JSON.stringify(initialSnippets));
    }
  }, []);

  useEffect(() => {
    if (snippets.length > 0 || localStorage.getItem('codeCapsuleSnippets')) {
        localStorage.setItem('codeCapsuleSnippets', JSON.stringify(snippets));
    }
  }, [snippets]);

  const handleAddSnippet = (data: SnippetFormData) => {
    const newSnippet: Snippet = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setSnippets(prev => [newSnippet, ...prev]);
    setIsFormOpen(false);
    setEditingSnippet(null);
    toast({ title: "Snippet Created", description: `Snippet "${data.description.substring(0,20)}..." has been added.` });
  };

  const handleUpdateSnippet = (data: SnippetFormData) => {
    if (!editingSnippet) return;
    const updatedSnippetData: Snippet = {
      ...editingSnippet,
      ...data,
    };
    setSnippets(prev =>
      prev.map(s => (s.id === editingSnippet.id ? updatedSnippetData : s))
    );
    setIsFormOpen(false);
    setEditingSnippet(null);
    toast({ title: "Snippet Updated", description: `Snippet "${updatedSnippetData.description.substring(0,20)}..." has been updated.` });
  };

  const handleDeleteSnippet = () => {
    if (!snippetToDeleteId) return;
    const snippet = snippets.find(s => s.id === snippetToDeleteId);
    setSnippets(prev => prev.filter(s => s.id !== snippetToDeleteId));
    setSnippetToDeleteId(null);
    if (snippet) {
     toast({ title: "Snippet Deleted", description: `Snippet "${snippet.description.substring(0,20)}..." has been deleted.`, variant: "destructive" });
    }
  };

  const openEditForm = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setIsFormOpen(true);
  };

  const openDeleteConfirm = (snippetId: string) => {
    setSnippetToDeleteId(snippetId);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingSnippet(null);
  };

  const allUniqueTags = useMemo(() => {
    const tagsSet = new Set<string>();
    snippets.forEach(snippet => snippet.tags?.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, [snippets]);

  const filteredSnippets = useMemo(() => {
    return snippets
      .filter(snippet => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearchTerm =
          snippet.description.toLowerCase().includes(searchTermLower) ||
          snippet.code.toLowerCase().includes(searchTermLower);
        
        const matchesTags = filterTags.length === 0 || 
          filterTags.every(tag => snippet.tags?.includes(tag));
          
        return matchesSearchTerm && matchesTags;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [snippets, filterTags, searchTerm]);

  if (isFormOpen) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {editingSnippet ? `Edit Snippet` : 'Create New Code Snippet'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {editingSnippet ? 'Update the details of your code snippet.' : 'Fill in the details for your new code snippet.'}
            </p>
          </div>
          <SnippetForm
            onSubmit={editingSnippet ? handleUpdateSnippet : handleAddSnippet}
            initialData={editingSnippet}
            onCancel={handleCancelForm}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
             <Code2 className="h-8 w-8 text-accent" />
             <span className="sr-only">Code Capsule</span>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Input
              type="text"
              placeholder="Search snippets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Search snippets"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button onClick={() => { setEditingSnippet(null); setIsFormOpen(true); }} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Snippet
          </Button>
        </div>

        <TagFilter
          allTags={allUniqueTags}
          selectedTags={filterTags}
          onSelectedTagsChange={setFilterTags}
        />

        <SnippetList
          snippets={filteredSnippets}
          onEdit={openEditForm}
          onDelete={openDeleteConfirm}
        />
      </main>

      <AlertDialog open={!!snippetToDeleteId} onOpenChange={() => setSnippetToDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the snippet "{snippets.find(s => s.id === snippetToDeleteId)?.description.substring(0,50)}...".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSnippetToDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSnippet}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
