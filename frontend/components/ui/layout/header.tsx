'use client';

import Navbar from '@/components/ui/layout/navbar';

export function Header() {
  return (
    <header className="bg-transparent dark:bg-transparent shadow-md">
      <div className="max-w-12xl mx-auto px-0 py-0">
        <Navbar />
      </div>
    </header>
  );
}
