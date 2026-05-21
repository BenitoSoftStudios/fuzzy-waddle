import { jsPDF } from 'jspdf';
import type { EstimateData } from '@/types/estimate';
import { lineItemTotal, estimateSubtotal, estimateTax, estimateTotal } from '@/types/estimate';

const BLUE = '#1e40af';
const DARK = '#111827';
const GRAY = '#6b7280';
const LIGHT_GRAY = '#f3f4f6';
const WHITE = '#ffffff';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function generatePDF(data: EstimateData, watermark = false): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = 0;

  // Header background
  doc.setFillColor(BLUE);
  doc.rect(0, 0, pageW, 90, 'F');

  // Company name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(WHITE);
  doc.text(data.contractor.name || 'Your Company', margin, 38);

  // "ESTIMATE" label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor('#bfdbfe');
  doc.text('ESTIMATE', pageW - margin, 38, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(WHITE);
  doc.text(data.estimateNumber || 'EST-001', pageW - margin, 58, { align: 'right' });

  // Contractor contact line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor('#bfdbfe');
  const contactParts = [data.contractor.email, data.contractor.phone, data.contractor.license ? `Lic: ${data.contractor.license}` : null].filter(Boolean);
  doc.text(contactParts.join('  ·  '), margin, 72);

  y = 110;

  // Bill To / Estimate Info section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(GRAY);
  doc.text('BILL TO', margin, y);
  doc.text('ESTIMATE DETAILS', margin + contentW / 2, y);

  y += 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(DARK);
  doc.text(data.client.name || 'Client Name', margin, y);

  // Estimate details right column
  const rightX = margin + contentW / 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(DARK);

  const details = [
    ['Date:', formatDate(data.estimateDate)],
    ['Valid Until:', formatDate(data.validUntil)],
    ['Contractor Address:', data.contractor.address],
  ];

  let detailY = y;
  for (const [label, value] of details) {
    if (!value) continue;
    doc.setFont('helvetica', 'bold');
    doc.text(label, rightX, detailY);
    doc.setFont('helvetica', 'normal');
    doc.text(value, rightX + 100, detailY);
    detailY += 14;
  }

  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const clientLines = [data.client.address, data.client.phone, data.client.email].filter(Boolean);
  for (const line of clientLines) {
    doc.text(line, margin, y);
    y += 13;
  }

  y = Math.max(y, detailY) + 20;

  // Project title
  if (data.projectTitle) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(DARK);
    doc.text(data.projectTitle, margin, y);
    y += 16;
  }

  if (data.projectDescription) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(GRAY);
    const descLines = doc.splitTextToSize(data.projectDescription, contentW);
    doc.text(descLines, margin, y);
    y += descLines.length * 13 + 10;
  }

  // Line items table header
  const colWidths = [contentW * 0.44, contentW * 0.12, contentW * 0.12, contentW * 0.14, contentW * 0.18];
  const colHeaders = ['Description', 'Qty', 'Unit', 'Unit Price', 'Total'];
  const colX = colWidths.reduce<number[]>((acc, w, i) => [...acc, (acc[i - 1] ?? margin) + (i > 0 ? colWidths[i - 1] : 0)], [margin]);

  doc.setFillColor(BLUE);
  doc.rect(margin - 4, y - 12, contentW + 8, 20, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(WHITE);

  for (let i = 0; i < colHeaders.length; i++) {
    const align = i > 0 ? 'right' : 'left';
    const x = i === 0 ? colX[i] : colX[i] + colWidths[i] - 2;
    doc.text(colHeaders[i], x, y, { align });
  }

  y += 12;

  // Line items rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);

  data.lineItems.forEach((item, idx) => {
    if (y > 700) {
      doc.addPage();
      y = 60;
    }

    if (idx % 2 === 0) {
      doc.setFillColor(LIGHT_GRAY);
      doc.rect(margin - 4, y - 10, contentW + 8, 18, 'F');
    }

    doc.setTextColor(DARK);
    const descText = doc.splitTextToSize(item.description || '—', colWidths[0] - 4);
    doc.text(descText, colX[0], y);
    doc.text(String(item.quantity), colX[1] + colWidths[1] - 2, y, { align: 'right' });
    doc.text(item.unit || '', colX[2] + colWidths[2] - 2, y, { align: 'right' });
    doc.text(formatCurrency(item.unitPrice), colX[3] + colWidths[3] - 2, y, { align: 'right' });
    doc.text(formatCurrency(lineItemTotal(item)), colX[4] + colWidths[4] - 2, y, { align: 'right' });

    y += Math.max(descText.length, 1) * 13 + 6;
  });

  y += 10;

  // Totals block
  const totalsX = margin + contentW * 0.62;
  const totalsW = contentW * 0.38;
  const subtotal = estimateSubtotal(data.lineItems);
  const tax = estimateTax(data.lineItems, data.taxRate);
  const total = estimateTotal(data.lineItems, data.taxRate);

  const totalsRows: [string, string][] = [
    ['Subtotal', formatCurrency(subtotal)],
    ...(data.taxRate > 0 ? [[`Tax (${data.taxRate}%)`, formatCurrency(tax)] as [string, string]] : []),
  ];

  for (const [label, value] of totalsRows) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(GRAY);
    doc.text(label, totalsX, y);
    doc.setTextColor(DARK);
    doc.text(value, totalsX + totalsW, y, { align: 'right' });
    y += 16;
  }

  // Total box
  doc.setFillColor(BLUE);
  doc.rect(totalsX - 8, y - 14, totalsW + 12, 24, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(WHITE);
  doc.text('TOTAL', totalsX, y);
  doc.text(formatCurrency(total), totalsX + totalsW, y, { align: 'right' });
  y += 28;

  // Notes
  if (data.notes) {
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(GRAY);
    doc.text('NOTES', margin, y);
    y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(DARK);
    const noteLines = doc.splitTextToSize(data.notes, contentW);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 13 + 10;
  }

  // Terms
  if (data.terms) {
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(GRAY);
    doc.text('TERMS & CONDITIONS', margin, y);
    y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(GRAY);
    const termLines = doc.splitTextToSize(data.terms, contentW);
    doc.text(termLines, margin, y);
    y += termLines.length * 12;
  }

  // Footer
  const pageH = doc.internal.pageSize.getHeight();
  doc.setDrawColor('#e5e7eb');
  doc.line(margin, pageH - 36, pageW - margin, pageH - 36);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(GRAY);

  if (watermark) {
    doc.text('Created with BuildQuote.app — buildquote.app', pageW / 2, pageH - 20, { align: 'center' });
    // Diagonal watermark
    doc.setFontSize(52);
    doc.setTextColor('#e5e7eb');
    doc.text('SAMPLE', pageW / 2, pageH / 2 + 30, { align: 'center', angle: 45 });
  } else {
    doc.text('buildquote.app', pageW / 2, pageH - 20, { align: 'center' });
  }

  const filename = `estimate-${data.estimateNumber || 'draft'}.pdf`;
  doc.save(filename);
}
