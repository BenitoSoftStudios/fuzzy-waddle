'use client';

import type { EstimateData } from '@/types/estimate';
import { lineItemTotal, estimateSubtotal, estimateTax, estimateTotal } from '@/types/estimate';

interface Props {
  data: EstimateData;
  watermark?: boolean;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function EstimatePreview({ data, watermark = false }: Props) {
  const subtotal = estimateSubtotal(data.lineItems);
  const tax = estimateTax(data.lineItems, data.taxRate);
  const total = estimateTotal(data.lineItems, data.taxRate);

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {watermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 rotate-[-30deg]">
          <span className="text-gray-200 text-6xl font-bold tracking-widest select-none opacity-80">SAMPLE</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-blue-700 px-6 py-5 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{data.contractor.name || 'Your Company'}</h2>
            <div className="text-blue-200 text-xs mt-1 space-y-0.5">
              {data.contractor.email && <div>{data.contractor.email}</div>}
              {data.contractor.phone && <div>{data.contractor.phone}</div>}
              {data.contractor.address && <div>{data.contractor.address}</div>}
              {data.contractor.license && <div>License: {data.contractor.license}</div>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-blue-200 text-xs uppercase tracking-wider">Estimate</div>
            <div className="text-lg font-bold">{data.estimateNumber || 'EST-001'}</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Bill To + Dates */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</div>
            <div className="text-sm font-semibold text-gray-900">{data.client.name || 'Client Name'}</div>
            <div className="text-xs text-gray-500 space-y-0.5 mt-1">
              {data.client.address && <div>{data.client.address}</div>}
              {data.client.phone && <div>{data.client.phone}</div>}
              {data.client.email && <div>{data.client.email}</div>}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Details</div>
            <div className="text-xs text-gray-600 space-y-1">
              {data.estimateDate && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-20 shrink-0">Date:</span>
                  <span>{formatDate(data.estimateDate)}</span>
                </div>
              )}
              {data.validUntil && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-20 shrink-0">Valid Until:</span>
                  <span>{formatDate(data.validUntil)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project */}
        {(data.projectTitle || data.projectDescription) && (
          <div>
            {data.projectTitle && <div className="font-semibold text-gray-900 text-sm">{data.projectTitle}</div>}
            {data.projectDescription && <div className="text-xs text-gray-500 mt-1">{data.projectDescription}</div>}
          </div>
        )}

        {/* Line Items */}
        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-700 text-white text-xs">
                <th className="text-left px-3 py-2 rounded-tl">Description</th>
                <th className="text-right px-3 py-2">Qty</th>
                <th className="text-right px-3 py-2">Unit</th>
                <th className="text-right px-3 py-2">Price</th>
                <th className="text-right px-3 py-2 rounded-tr">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.lineItems.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-3 py-2 text-gray-800">{item.description || '—'}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{item.quantity}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{item.unit}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-3 py-2 text-right font-medium text-gray-800">{formatCurrency(lineItemTotal(item))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-56 space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {data.taxRate > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax ({data.taxRate}%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-white bg-blue-700 rounded px-3 py-2 mt-2">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Notes</div>
            <div className="text-xs text-gray-600 whitespace-pre-line">{data.notes}</div>
          </div>
        )}

        {/* Terms */}
        {data.terms && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Terms & Conditions</div>
            <div className="text-xs text-gray-400 whitespace-pre-line">{data.terms}</div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 pt-3 text-center text-xs text-gray-300">
          {watermark ? 'Created with QuoteKit.app — quotekit.app' : 'quotekit.app'}
        </div>
      </div>
    </div>
  );
}
