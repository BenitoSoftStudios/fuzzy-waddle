import Link from 'next/link';

interface Props {
  title: string;
  price: string;
  priceNote?: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
}

export default function PricingCard({ title, price, priceNote, features, cta, ctaHref, highlighted = false }: Props) {
  return (
    <div className={`rounded-xl border p-6 flex flex-col gap-4 ${highlighted ? 'border-blue-700 shadow-lg bg-blue-700 text-white' : 'border-gray-200 bg-white text-gray-900'}`}>
      <div>
        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${highlighted ? 'text-blue-200' : 'text-gray-400'}`}>{title}</div>
        <div className="text-3xl font-bold">{price}</div>
        {priceNote && <div className={`text-sm mt-1 ${highlighted ? 'text-blue-200' : 'text-gray-500'}`}>{priceNote}</div>}
      </div>
      <ul className="space-y-2 flex-1">
        {features.map((f) => (
          <li key={f} className={`text-sm flex items-start gap-2 ${highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
            <span className={`mt-0.5 ${highlighted ? 'text-blue-300' : 'text-blue-600'}`}>&#10003;</span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={`text-center py-2.5 rounded-md font-medium text-sm transition-colors ${
          highlighted
            ? 'bg-white text-blue-700 hover:bg-blue-50'
            : 'bg-blue-700 text-white hover:bg-blue-800'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
