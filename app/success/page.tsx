'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { STORAGE_KEY, PAID_SESSION_KEY, emptyEstimate } from '@/types/estimate';
import type { EstimateData } from '@/types/estimate';
import { generatePDF } from '@/lib/pdf';
import { Suspense } from 'react';

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get('session_id') ?? '';

  const [status, setStatus] = useState<'verifying' | 'ready' | 'error'>('verifying');
  const [data, setData] = useState<EstimateData>(emptyEstimate);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    // Load estimate data
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as EstimateData);
    } catch {
      // ignore
    }

    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Check if already verified in this session
    try {
      const paidRaw = localStorage.getItem(PAID_SESSION_KEY);
      const paidSessions: string[] = paidRaw ? JSON.parse(paidRaw) : [];
      if (paidSessions.includes(sessionId)) {
        setStatus('ready');
        return;
      }
    } catch {
      // ignore
    }

    // Verify with our API
    fetch(`/api/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.paid) {
          // Mark session as paid in localStorage
          try {
            const paidRaw = localStorage.getItem(PAID_SESSION_KEY);
            const paidSessions: string[] = paidRaw ? JSON.parse(paidRaw) : [];
            paidSessions.push(sessionId);
            localStorage.setItem(PAID_SESSION_KEY, JSON.stringify(paidSessions.slice(-20)));
          } catch {
            // ignore
          }
          setStatus('ready');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [sessionId]);

  const downloadPDF = () => {
    generatePDF(data, false);
    setDownloaded(true);
  };

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Verifying your payment...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4">&#9888;</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
        <p className="text-gray-500 text-sm mb-6">
          We couldn&apos;t verify your payment. If you were charged, please contact support with your session ID: <code className="bg-gray-100 px-1 rounded text-xs">{sessionId}</code>
        </p>
        <button onClick={() => router.push('/preview')} className="bg-blue-700 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-800">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
        &#10003;
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmed!</h1>
      <p className="text-gray-500 mb-8">Your clean, professional estimate PDF is ready to download.</p>

      <button
        onClick={downloadPDF}
        className="w-full bg-blue-700 text-white py-3.5 rounded-md font-semibold text-base hover:bg-blue-800 transition-colors mb-4"
      >
        Download Clean PDF
      </button>

      {downloaded && (
        <p className="text-green-600 text-sm mb-4">Your PDF is downloading. Check your Downloads folder.</p>
      )}

      <div className="flex flex-col gap-2 mt-6">
        <button
          onClick={() => router.push('/builder')}
          className="text-gray-500 text-sm hover:text-gray-700"
        >
          Create another estimate
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-8">
        Payment ID: <code className="bg-gray-100 px-1 rounded">{sessionId.slice(0, 20)}...</code>
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
