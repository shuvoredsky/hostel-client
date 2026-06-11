"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import browserClient from "@/lib/browserClient";

export default function InvoiceDownloadButton({
  paymentId,
}: {
  paymentId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await browserClient.get(
        `/payments/invoice/${paymentId}`,
        { responseType: "blob" }  // PDF binary data
      );

      // Blob থেকে download link বানাও
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${paymentId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Invoice download failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      <Download className="w-3.5 h-3.5" />
      {loading ? "..." : "PDF"}
    </button>
  );
}