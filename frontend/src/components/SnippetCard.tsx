
import React from 'react';
import type { Snippet } from '@/types';
import { LANGUAGE_OPTIONS } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Edit3, Trash2, Clock, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { mapLanguageForSyntaxHighlighter } from '@/lib/syntaxHighlighterUtils';
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippetId: string) => void;
}

export function SnippetCard({ snippet, onEdit, onDelete }: SnippetCardProps) {
  const LanguageIcon = LANGUAGE_OPTIONS.find(lang => lang.value === snippet.language)?.icon;
  const { toast } = useToast();

  const formattedDate = React.useMemo(() => {
    try {
      return formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  }, [snippet.createdAt]);

  const highlighterLanguage = mapLanguageForSyntaxHighlighter(snippet.language);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      toast({
        title: "Code Copied!",
        description: "The snippet code has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy code to clipboard. Please try again.",
        variant: "destructive",
      });
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <TooltipProvider>
      <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center text-sm font-medium text-muted-foreground w-full">
              {LanguageIcon && <LanguageIcon className="mr-1.5 h-4 w-4" />}
              {LANGUAGE_OPTIONS.find(lang => lang.value === snippet.language)?.label || snippet.language}
            </div>
          </div>
          {snippet.description && <CardDescription className="pt-2 text-base">{snippet.description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden pt-0">
          <ScrollArea className="h-48 rounded-md border bg-muted/30">
            <SyntaxHighlighter
              language={highlighterLanguage}
              style={materialLight}
              customStyle={{
                margin: 0,
                padding: '0.75rem',
                backgroundColor: 'transparent',
                fontSize: '0.875rem', // text-sm
                lineHeight: '1.25rem', // leading-tight equivalent for pre
              }}
              codeTagProps={{
                style: {
                  fontFamily: 'var(--font-geist-mono)', // Ensure mono font
                  whiteSpace: 'pre-wrap', // Allow wrapping
                  wordBreak: 'break-all', // Ensure long lines break
                }
              }}
              showLineNumbers={false}
              wrapLines={true}
            >
              {snippet.code}
            </SyntaxHighlighter>
          </ScrollArea>
          {snippet.tags && snippet.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {snippet.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t pt-4 mt-auto">
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" /> {formattedDate}
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleCopyCode} aria-label="Copy code">
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy code</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => onEdit(snippet)} aria-label="Edit snippet">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit snippet</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" onClick={() => onDelete(snippet.id)} aria-label="Delete snippet">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete snippet</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
