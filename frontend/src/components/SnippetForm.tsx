
"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TagInput } from '@/components/TagInput';
import type { Snippet, SnippetFormData } from '@/types';
import { LANGUAGE_OPTIONS } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { mapLanguageForSyntaxHighlighter } from '@/lib/syntaxHighlighterUtils';

const snippetFormSchema = z.object({
  code: z.string().min(1, "Code cannot be empty"),
  description: z.string().min(1, "Description cannot be empty").max(200, "Description must be 200 characters or less"),
  language: z.string().min(1, "Language is required"),
  tags: z.array(z.string()).max(10, "Maximum of 10 tags allowed").optional(),
});

type FormDataType = SnippetFormData;

interface SnippetFormProps {
  onSubmit: (data: FormDataType) => void;
  initialData?: Snippet | null;
  onCancel: () => void;
}

export function SnippetForm({ onSubmit, initialData, onCancel }: SnippetFormProps) {
  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<FormDataType>({
    resolver: zodResolver(snippetFormSchema),
    defaultValues: initialData ? {
      code: initialData.code,
      description: initialData.description,
      language: initialData.language,
      tags: initialData.tags,
    } : {
      code: '',
      description: '',
      language: LANGUAGE_OPTIONS[0].value,
      tags: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        code: '',
        description: '',
        language: LANGUAGE_OPTIONS[0].value,
        tags: [],
      });
    }
  }, [initialData, reset]);

  const currentLanguageValue = watch("language");
  const currentCodeValue = watch("code");
  const highlighterLanguage = mapLanguageForSyntaxHighlighter(currentLanguageValue);

  const handleFormSubmit = (data: FormDataType) => {
    onSubmit(data);
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-grow space-y-0 overflow-hidden">
      <ScrollArea className="flex-grow p-1 pr-4">
        <div className="space-y-6 py-2">
          <div>
            <Label htmlFor="language">Language</Label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isEditing}
                >
                  <SelectTrigger
                    id="language"
                    aria-invalid={errors.language ? "true" : "false"}
                    disabled={isEditing}
                    className={isEditing ? "cursor-not-allowed opacity-70" : ""}
                  >
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value} disabled={isEditing && field.value !== option.value}>
                        <div className="flex items-center gap-2">
                          {option.icon && <option.icon className="h-4 w-4 text-muted-foreground" />}
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.language && <p className="text-sm text-destructive mt-1">{errors.language.message}</p>}
          </div>

          <div>
            <Label htmlFor="code">Code</Label>
            <div
              className="relative mt-1 w-full rounded-md border border-input bg-muted/30 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden"
              style={{ height: '250px' }}
            >
              <ScrollArea className="absolute inset-0 w-full h-full">
                <div className="relative min-h-full">
                  <SyntaxHighlighter
                    language={highlighterLanguage}
                    style={materialLight}
                    customStyle={{
                      margin: 0,
                      padding: '0.75rem', 
                      backgroundColor: 'transparent !important',
                      fontSize: '0.875rem', 
                      lineHeight: '1.25rem', 
                      fontFamily: 'var(--font-geist-mono)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily: 'var(--font-geist-mono)',
                      }
                    }}
                    showLineNumbers={false} 
                    wrapLines={true}
                  >
                    {currentCodeValue ? `${currentCodeValue}\n` : '\u00A0'}
                  </SyntaxHighlighter>
                  <Textarea
                    id="code"
                    {...register('code')}
                    className="absolute inset-0 w-full h-full p-[0.75rem] font-mono text-sm bg-transparent text-transparent caret-foreground resize-none border-none outline-none focus:ring-0 focus-visible:ring-0 whitespace-pre-wrap break-all"
                    aria-invalid={errors.code ? "true" : "false"}
                    placeholder="Your code snippet here..."
                    spellCheck="false"
                  />
                </div>
              </ScrollArea>
            </div>
            {errors.code && <p className="text-sm text-destructive mt-1">{errors.code.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={3}
              aria-invalid={errors.description ? "true" : "false"}
              placeholder="A brief description of your code snippet."
            />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add tags like 'react', 'utility', etc."
                />
              )}
            />
            {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags.message}</p>}
          </div>
        </div>
      </ScrollArea>
      <div className="flex justify-end gap-2 pt-6 border-t mt-auto">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Save Changes' : 'Create Snippet'}
        </Button>
      </div>
    </form>
  );
}

