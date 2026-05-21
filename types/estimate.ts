export interface ContractorInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  license: string;
}

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface EstimateData {
  contractor: ContractorInfo;
  client: ClientInfo;
  estimateNumber: string;
  estimateDate: string;
  validUntil: string;
  projectTitle: string;
  projectDescription: string;
  lineItems: LineItem[];
  taxRate: number;
  notes: string;
  terms: string;
}

export function emptyEstimate(): EstimateData {
  const today = new Date();
  const validDate = new Date(today);
  validDate.setDate(validDate.getDate() + 30);

  return {
    contractor: { name: '', email: '', phone: '', address: '', license: '' },
    client: { name: '', email: '', phone: '', address: '' },
    estimateNumber: `EST-${String(Math.floor(Math.random() * 900) + 100)}`,
    estimateDate: today.toISOString().split('T')[0],
    validUntil: validDate.toISOString().split('T')[0],
    projectTitle: '',
    projectDescription: '',
    lineItems: [
      { id: crypto.randomUUID(), description: '', quantity: 1, unit: 'hrs', unitPrice: 0 },
    ],
    taxRate: 0,
    notes: '',
    terms: 'Payment due within 30 days of estimate acceptance. 50% deposit required before work begins.',
  };
}

export function lineItemTotal(item: LineItem): number {
  return item.quantity * item.unitPrice;
}

export function estimateSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + lineItemTotal(item), 0);
}

export function estimateTax(items: LineItem[], taxRate: number): number {
  return estimateSubtotal(items) * (taxRate / 100);
}

export function estimateTotal(items: LineItem[], taxRate: number): number {
  return estimateSubtotal(items) + estimateTax(items, taxRate);
}

export const STORAGE_KEY = 'buildquote_estimate';
export const PAID_SESSION_KEY = 'buildquote_paid_sessions';
