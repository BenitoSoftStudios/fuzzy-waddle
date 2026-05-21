import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'BuildQuote — Professional Contractor Estimate Generator',
  description: 'Create professional contractor estimates in minutes. Fill in your details, add line items, and download a clean PDF. Free to try — $4.99 for a clean PDF.',
};

const steps = [
  { num: '1', title: 'Fill in your details', desc: 'Enter your business info, client info, and project details.' },
  { num: '2', title: 'Add line items', desc: 'Add labor, materials, and any other charges with quantities and prices.' },
  { num: '3', title: 'Download your PDF', desc: 'Preview your estimate, then download a clean, professional PDF.' },
];

const features = [
  'Professional PDF layout clients trust',
  'Automatic subtotal, tax, and total calculation',
  'Your business name and contact info on every estimate',
  'Works on phone, tablet, or desktop',
  'No account required — start immediately',
];

const trades = ['Plumbers', 'Electricians', 'Roofers', 'HVAC Techs', 'Painters', 'General Contractors', 'Carpenters', 'Landscapers'];

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Free to try — $4.99 for a clean PDF
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Professional Contractor Estimates,<br className="hidden sm:block" /> in Minutes
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
            Stop losing jobs to sloppy quotes. Create a clean, professional estimate PDF your clients will take seriously — no templates to mess with, no software to install.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/builder"
              className="bg-blue-700 text-white px-8 py-3.5 rounded-md font-semibold text-base hover:bg-blue-800 transition-colors"
            >
              Create Your Estimate — Free
            </Link>
            <Link
              href="/pricing"
              className="border border-gray-300 text-gray-700 px-8 py-3.5 rounded-md font-semibold text-base hover:bg-gray-50 transition-colors"
            >
              See Pricing
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">No account required. Takes 2 minutes.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-700 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-16 grid sm:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Everything you need, nothing you don't</h2>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="text-blue-600 mt-0.5 font-bold text-base">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/builder" className="inline-block mt-6 bg-blue-700 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 transition-colors">
              Try It Now — Free
            </Link>
          </div>
          {/* Fake preview card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="bg-blue-700 rounded-t-lg p-4 -mx-6 -mt-6 mb-4 text-white">
              <div className="font-bold text-lg">ABC Plumbing LLC</div>
              <div className="text-blue-200 text-xs">abc@plumbing.com · (555) 123-4567</div>
              <div className="text-right text-sm font-bold -mt-6">EST-042</div>
            </div>
            <div className="text-xs text-gray-500 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Bill To:</span>
                <span className="font-medium text-gray-700">Jane Smith</span>
              </div>
              <div className="border-t border-gray-100 pt-2">
                <div className="grid grid-cols-4 gap-1 font-semibold bg-blue-700 text-white rounded px-2 py-1 text-xs mb-1">
                  <span className="col-span-2">Description</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Total</span>
                </div>
                {[['Labor — pipe repair', '3 hrs', '$450'], ['Parts — fittings', '1 lot', '$85'], ['Service call', '1', '$75']].map(([d, q, t]) => (
                  <div key={d} className="grid grid-cols-4 gap-1 px-2 py-0.5 even:bg-gray-50 text-xs">
                    <span className="col-span-2 text-gray-700">{d}</span>
                    <span className="text-right text-gray-500">{q}</span>
                    <span className="text-right font-medium text-gray-800">{t}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 font-bold text-blue-700">
                <span>Total</span>
                <span>$610.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Built for independent contractors</h2>
        <p className="text-gray-500 text-sm mb-8">If you work in the trades, this is for you.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {trades.map((t) => (
            <span key={t} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">{t}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white">
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to send a professional estimate?</h2>
          <p className="text-blue-200 mb-6">Try it free. Download the clean PDF for $4.99.</p>
          <Link
            href="/builder"
            className="inline-block bg-white text-blue-700 px-8 py-3.5 rounded-md font-semibold hover:bg-blue-50 transition-colors"
          >
            Create My Estimate Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} BuildQuote. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
            <Link href="/builder" className="hover:text-gray-600">Create Estimate</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
