"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, XCircle } from 'lucide-react';

interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onSelectedTagsChange: (tags: string[]) => void;
}

export function TagFilter({ allTags, selectedTags, onSelectedTagsChange }: TagFilterProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onSelectedTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onSelectedTagsChange([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    onSelectedTagsChange([]);
  };

  if (allTags.length === 0 && selectedTags.length === 0) {
    return null; // Don't render if there are no tags at all
  }

  return (
    <div className="p-4 border rounded-lg bg-card shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="h-4 w-4" />
          Filter by Tags
        </div>
        {selectedTags.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            <XCircle className="h-3.5 w-3.5 mr-1.5" />
            Clear Filters
          </Button>
        )}
      </div>
      {allTags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
              onClick={() => toggleTag(tag)}
              className="cursor-pointer transition-all hover:opacity-80 text-xs px-2.5 py-1"
              role="checkbox"
              aria-checked={selectedTags.includes(tag)}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleTag(tag); }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No tags available to filter by.</p>
      )}
    </div>
  );
}
