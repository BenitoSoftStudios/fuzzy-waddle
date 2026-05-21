'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import EstimateForm from '@/components/EstimateForm';
import EstimatePreview from '@/components/EstimatePreview';
import { emptyEstimate, STORAGE_KEY } from '@/types/estimate';
import type { EstimateData } from '@/types/estimate';

function loadSaved(): EstimateData {
  if (typeof window === 'undefined') return emptyEstimate();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as EstimateData;
  } catch {
    // ignore corrupt data
  }
  return emptyEstimate();
}

export default function BuilderPage() {
  const router = useRouter();
  const [data, setData] = useState<EstimateData>(emptyEstimate);
  const [tab, setTab] = useState<'form' | 'preview'>('form');
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    setData(loadSaved());
    setHydrated(true);
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore storage errors
    }
  }, [data, hydrated]);

  const handleChange = useCallback((updated: EstimateData) => {
    setData(updated);
  }, []);

  const goToPreview = () => {
    router.push('/preview');
  };

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Your Estimate</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details on the left. Preview updates live on the right.</p>
      </div>

      {/* Mobile tab switcher */}
      <div className="flex sm:hidden gap-1 bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setTab('form')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'form' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          Edit
        </button>
        <button
          onClick={() => setTab('preview')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form panel */}
        <div className={`${tab === 'preview' ? 'hidden sm:block' : ''}`}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <EstimateForm data={data} onChange={handleChange} />
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={goToPreview}
                className="flex-1 bg-blue-700 text-white py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors text-center"
              >
                Preview & Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className={`${tab === 'form' ? 'hidden sm:block' : ''}`}>
          <div className="sticky top-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Live Preview</span>
              <button
                onClick={goToPreview}
                className="text-blue-700 text-sm font-medium hover:underline"
              >
                Download PDF &rarr;
              </button>
            </div>
            <EstimatePreview data={data} watermark />
          </div>
        </div>
      </div>
    </main>
  );
}
