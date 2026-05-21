'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const path = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-blue-700 text-lg tracking-tight">
          QuoteKit
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/pricing" className={`text-gray-600 hover:text-blue-700 ${path === '/pricing' ? 'text-blue-700 font-medium' : ''}`}>
            Pricing
          </Link>
          <Link
            href="/builder"
            className="bg-blue-700 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors"
          >
            Create Estimate
          </Link>
        </div>
      </div>
    </nav>
  );
}
