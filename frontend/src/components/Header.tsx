import { Code2 } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Code2 className="h-7 w-7 text-accent" />
          {/* Removed <span>Code Capsule</span> */}
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
