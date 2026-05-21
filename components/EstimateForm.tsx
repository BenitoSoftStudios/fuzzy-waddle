'use client';

import { useCallback } from 'react';
import type { EstimateData, LineItem } from '@/types/estimate';

interface Props {
  data: EstimateData;
  onChange: (data: EstimateData) => void;
}

function Field({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3, placeholder = '' }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
      />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wider border-b border-blue-100 pb-2 mb-4">
      {children}
    </h3>
  );
}

export default function EstimateForm({ data, onChange }: Props) {
  const set = useCallback(<K extends keyof EstimateData>(key: K, value: EstimateData[K]) => {
    onChange({ ...data, [key]: value });
  }, [data, onChange]);

  const setContractor = useCallback((field: keyof EstimateData['contractor'], value: string) => {
    onChange({ ...data, contractor: { ...data.contractor, [field]: value } });
  }, [data, onChange]);

  const setClient = useCallback((field: keyof EstimateData['client'], value: string) => {
    onChange({ ...data, client: { ...data.client, [field]: value } });
  }, [data, onChange]);

  const updateLineItem = useCallback((id: string, field: keyof LineItem, value: string | number) => {
    onChange({
      ...data,
      lineItems: data.lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  }, [data, onChange]);

  const addLineItem = useCallback(() => {
    onChange({
      ...data,
      lineItems: [
        ...data.lineItems,
        { id: crypto.randomUUID(), description: '', quantity: 1, unit: 'hrs', unitPrice: 0 },
      ],
    });
  }, [data, onChange]);

  const removeLineItem = useCallback((id: string) => {
    if (data.lineItems.length <= 1) return;
    onChange({ ...data, lineItems: data.lineItems.filter((item) => item.id !== id) });
  }, [data, onChange]);

  return (
    <div className="space-y-8">
      {/* Your Info */}
      <section>
        <SectionTitle>Your Info (Contractor)</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Business Name" value={data.contractor.name} onChange={(v) => setContractor('name', v)} placeholder="ABC Plumbing LLC" />
          <Field label="License Number" value={data.contractor.license} onChange={(v) => setContractor('license', v)} placeholder="LIC-12345" />
          <Field label="Email" value={data.contractor.email} onChange={(v) => setContractor('email', v)} type="email" placeholder="you@company.com" />
          <Field label="Phone" value={data.contractor.phone} onChange={(v) => setContractor('phone', v)} type="tel" placeholder="(555) 000-0000" />
          <div className="sm:col-span-2">
            <Field label="Address" value={data.contractor.address} onChange={(v) => setContractor('address', v)} placeholder="123 Main St, City, State 00000" />
          </div>
        </div>
      </section>

      {/* Client Info */}
      <section>
        <SectionTitle>Client Info</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Client Name" value={data.client.name} onChange={(v) => setClient('name', v)} placeholder="Jane Smith" />
          <Field label="Client Phone" value={data.client.phone} onChange={(v) => setClient('phone', v)} type="tel" placeholder="(555) 111-2222" />
          <Field label="Client Email" value={data.client.email} onChange={(v) => setClient('email', v)} type="email" placeholder="client@email.com" />
          <div className="sm:col-span-2">
            <Field label="Client Address" value={data.client.address} onChange={(v) => setClient('address', v)} placeholder="456 Oak Ave, City, State 00000" />
          </div>
        </div>
      </section>

      {/* Estimate Details */}
      <section>
        <SectionTitle>Estimate Details</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Estimate #" value={data.estimateNumber} onChange={(v) => set('estimateNumber', v)} placeholder="EST-001" />
          <Field label="Estimate Date" value={data.estimateDate} onChange={(v) => set('estimateDate', v)} type="date" />
          <Field label="Valid Until" value={data.validUntil} onChange={(v) => set('validUntil', v)} type="date" />
          <div className="sm:col-span-3">
            <Field label="Project Title" value={data.projectTitle} onChange={(v) => set('projectTitle', v)} placeholder="Bathroom Plumbing Repair" />
          </div>
          <div className="sm:col-span-3">
            <TextArea
              label="Project Description"
              value={data.projectDescription}
              onChange={(v) => set('projectDescription', v)}
              rows={2}
              placeholder="Brief description of the work to be performed..."
            />
          </div>
        </div>
      </section>

      {/* Line Items */}
      <section>
        <SectionTitle>Line Items</SectionTitle>
        <div className="space-y-3">
          <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide px-1">
            <span className="col-span-5">Description</span>
            <span className="col-span-2">Qty</span>
            <span className="col-span-2">Unit</span>
            <span className="col-span-2">Price</span>
            <span className="col-span-1"></span>
          </div>

          {data.lineItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-12 sm:col-span-5">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                  placeholder="Labor — pipe repair"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <input
                  type="number"
                  value={item.quantity}
                  min={0}
                  step={0.5}
                  onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <input
                  type="text"
                  value={item.unit}
                  onChange={(e) => updateLineItem(item.id, 'unit', e.target.value)}
                  placeholder="hrs"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-4 sm:col-span-2 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  value={item.unitPrice}
                  min={0}
                  step={0.01}
                  onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-md pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-12 sm:col-span-1 flex justify-end sm:justify-center">
                <button
                  onClick={() => removeLineItem(item.id)}
                  disabled={data.lineItems.length <= 1}
                  className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-lg leading-none"
                  title="Remove line"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addLineItem}
            className="text-blue-700 text-sm font-medium hover:underline"
          >
            + Add Line Item
          </button>
        </div>

        {/* Tax rate */}
        <div className="mt-4 flex items-center gap-3">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Tax Rate (%)</label>
          <input
            type="number"
            value={data.taxRate}
            min={0}
            max={100}
            step={0.1}
            onChange={(e) => set('taxRate', parseFloat(e.target.value) || 0)}
            className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400 text-xs">Set to 0 if no tax applies</span>
        </div>
      </section>

      {/* Notes & Terms */}
      <section>
        <SectionTitle>Notes & Terms</SectionTitle>
        <div className="space-y-4">
          <TextArea
            label="Notes (optional)"
            value={data.notes}
            onChange={(v) => set('notes', v)}
            rows={2}
            placeholder="Any special instructions or notes for the client..."
          />
          <TextArea
            label="Terms & Conditions"
            value={data.terms}
            onChange={(v) => set('terms', v)}
            rows={3}
          />
        </div>
      </section>
    </div>
  );
}
