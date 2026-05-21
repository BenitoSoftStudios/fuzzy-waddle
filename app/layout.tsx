import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Estimly — Professional Contractor Estimate Generator',
    template: '%s | Estimly',
  },
  description: 'Create professional contractor estimates in minutes. Fill in your details, add line items, and download a clean PDF. Free to try.',
  keywords: ['contractor estimate', 'estimate generator', 'contractor quote', 'PDF estimate', 'contractor invoice template'],
  openGraph: {
    title: 'Estimly — Contractor Estimate Generator',
    description: 'Create professional contractor estimates in minutes. Download as PDF.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <NavBar />
        {children}
        {/* Add your analytics snippet here. Example: Plausible Analytics */}
        {/* <script defer data-domain="yourdomain.com" src="https://plausible.io/js/plausible.js"></script> */}
      </body>
    </html>
  );
}
