"use client";

import { Download } from "lucide-react";

export default function InvoiceDownloadButton({
  paymentId,
}: {
  paymentId: string;
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
  const invoiceUrl = `${baseUrl}/payments/invoice/${paymentId}`;

  return (
    <a
      href={invoiceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
    >
      <Download className="w-3.5 h-3.5" />
      Invoice
    </a>
  );
}