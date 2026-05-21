'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EstimatePreview from '@/components/EstimatePreview';
import { emptyEstimate, STORAGE_KEY } from '@/types/estimate';
import type { EstimateData } from '@/types/estimate';
import { generatePDF } from '@/lib/pdf';

function loadEstimate(): EstimateData {
  if (typeof window === 'undefined') return emptyEstimate();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as EstimateData;
  } catch {
    // ignore
  }
  return emptyEstimate();
}

export default function PreviewPage() {
  const router = useRouter();
  const [data, setData] = useState<EstimateData>(emptyEstimate);
  const [hydrated, setHydrated] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setData(loadEstimate());
    setHydrated(true);
  }, []);

  const downloadFree = () => {
    generatePDF(data, true);
  };

  const downloadClean = async () => {
    setCheckingOut(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        setError(json.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Estimate Preview</h1>
          <p className="text-gray-500 text-sm mt-1">
            <button onClick={() => router.push('/builder')} className="text-blue-700 hover:underline">
              &larr; Edit estimate
            </button>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview */}
        <div className="lg:col-span-2">
          <EstimatePreview data={data} watermark />
        </div>

        {/* Download panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Download Your PDF</h2>
              <p className="text-gray-500 text-sm mt-1">Choose your download option.</p>
            </div>

            {/* Clean PDF */}
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 text-sm">Clean PDF</span>
                <span className="font-bold text-blue-700">$4.99</span>
              </div>
              <ul className="text-xs text-gray-500 space-y-1 mb-3">
                <li>&#10003; Professional, watermark-free</li>
                <li>&#10003; Looks great printed or emailed</li>
                <li>&#10003; Secure payment via Stripe</li>
              </ul>
              <button
                onClick={downloadClean}
                disabled={checkingOut}
                className="w-full bg-blue-700 text-white py-2.5 rounded-md font-semibold text-sm hover:bg-blue-800 disabled:opacity-60 transition-colors"
              >
                {checkingOut ? 'Redirecting to Stripe...' : 'Download Clean PDF — $4.99'}
              </button>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>

            {/* Free PDF */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 text-sm">Watermarked PDF</span>
                <span className="font-bold text-gray-500">Free</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Has &ldquo;SAMPLE&rdquo; stamped on it. Good for sharing a draft.</p>
              <button
                onClick={downloadFree}
                className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Download Watermarked PDF — Free
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Not happy with how it looks?{' '}
              <button onClick={() => router.push('/builder')} className="text-blue-700 hover:underline">
                Go back and edit
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
