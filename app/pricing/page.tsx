import type { Metadata } from 'next';
import PricingCard from '@/components/PricingCard';

export const metadata: Metadata = {
  title: 'Pricing — BuildQuote',
  description: 'Simple, transparent pricing. Free to build your estimate. $4.99 to download a clean, professional PDF.',
};

export default function PricingPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Simple Pricing</h1>
        <p className="text-gray-500">Free to try. Pay only when you want to download a clean PDF.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <PricingCard
          title="Free"
          price="$0"
          priceNote="Forever free"
          features={[
            'Build your full estimate',
            'Live preview',
            'Download watermarked PDF',
            'No account required',
          ]}
          cta="Create Estimate"
          ctaHref="/builder"
        />
        <PricingCard
          title="Clean PDF"
          price="$4.99"
          priceNote="Per download"
          features={[
            'Everything in Free',
            'Clean, professional PDF — no watermark',
            'Looks great on any device',
            'Re-download on the same session',
          ]}
          cta="Create & Download"
          ctaHref="/builder"
          highlighted
        />
      </div>

      <div className="mt-12 max-w-xl mx-auto">
        <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          {[
            {
              q: 'Do I need to create an account?',
              a: 'No. BuildQuote works without any signup. Your estimate is built in your browser and downloaded instantly.',
            },
            {
              q: 'What does the watermarked PDF look like?',
              a: 'It has "SAMPLE" stamped across it and a small BuildQuote footer. Great for showing a client a draft, but not for submitting a final estimate.',
            },
            {
              q: 'Can I re-download after paying?',
              a: 'Yes, within the same browser session. If you close your browser, you\'ll need to rebuild the estimate (it takes under 2 minutes).',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'All major credit and debit cards via Stripe. Apple Pay and Google Pay are supported on compatible devices.',
            },
            {
              q: 'Can I get a refund?',
              a: 'If you had a problem with your download, contact us and we\'ll sort it out.',
            },
          ].map(({ q, a }) => (
            <div key={q}>
              <div className="font-semibold text-gray-800 text-sm">{q}</div>
              <div className="text-gray-500 text-sm mt-1">{a}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
