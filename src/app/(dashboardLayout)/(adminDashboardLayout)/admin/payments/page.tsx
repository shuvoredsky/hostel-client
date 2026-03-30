"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import browserClient from "@/lib/browserClient";
import { formatDate, formatPrice, getStatusColor } from "@/lib/utils";
import { CreditCard, TrendingUp, ShieldCheck, Download } from "lucide-react";

export default function AdminPaymentsPage() {
  const { isLoading: authLoading } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalCommission: 0,
    totalPaid: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<string>("1");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await browserClient.get("/payments/admin/all", {
          params: {
            page: page || "1",
            limit: "20",
          },
        });
        const data = response?.data?.data;
      setPayments(data?.payments || []);
setSummary({
  totalRevenue: data?.payments?.filter((p: any) => p.status === "PAID")
    .reduce((s: number, p: any) => s + (p.amount || 0), 0) || 0,
  totalCommission: data?.totalCommission || 0,
  totalPaid: data?.payments?.filter((p: any) => p.status === "PAID").length || 0,
});
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load payments");
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [page]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          All Payments
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {payments.length} payments found
        </p>
      </div>

      {authLoading || isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading payments...</p>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Error loading payments
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {error}
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Total Revenue",
                value: formatPrice(summary.totalRevenue),
                icon: TrendingUp,
                color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600",
              },
              {
                label: "Total Commission",
                value: formatPrice(summary.totalCommission),
                icon: ShieldCheck,
                color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
              },
              {
                label: "Paid Transactions",
                value: summary.totalPaid,
                icon: CreditCard,
                color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}
                >
                  <card.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {card.value}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {card.label}
                </p>
              </div>
            ))}
          </div>

          {/* Payments Table */}
          {payments.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Student
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Listing
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Amount
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Commission
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Paid At
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment: any) => (
                  <tr
                    key={payment.id}
                    className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {payment.student?.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {payment.student?.email}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-600 dark:text-slate-400 truncate max-w-[150px]">
                        {payment.booking?.listing?.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {payment.booking?.listing?.area}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-medium text-emerald-600">
                      {formatPrice(payment.amount || 0)}
                    </td>
                    <td className="px-5 py-4 font-medium text-purple-600">
                      {formatPrice(payment.commission || 0)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {payment.paidAt ? formatDate(payment.paidAt) : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {payment.status === "PAID" && (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/invoice/${payment.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No payments found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Payments will appear here once students complete transactions
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}