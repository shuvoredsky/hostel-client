"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import browserClient from "@/lib/browserClient";
import { formatDate, formatPrice, getStatusColor } from "@/lib/utils";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  TrendingUp,
  Download,
} from "lucide-react";
import Image from "next/image";
import InvoiceDownloadButton from "./InvoiceDownloadButton";

export default function OwnerPaymentsPage() {
  const { isLoading: authLoading } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
       const response = await browserClient.get("/payments/owner/all");
        setPayments(response?.data?.data || []);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load payments");
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  const paidPayments = payments.filter((p) => p.status === "PAID");
  const unpaidPayments = payments.filter((p) => p.status === "UNPAID");
  const failedPayments = payments.filter((p) => p.status === "FAILED");

  const totalRevenue = paidPayments.reduce(
    (sum, p) => sum + (p.totalAmount || p.amount || 0),
    0
  );
  const totalPending = unpaidPayments.reduce(
    (sum, p) => sum + (p.totalAmount || p.amount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Payments
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Track all payments from your tenants
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
              {paidPayments.length} paid
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Revenue
          </p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {formatPrice(totalRevenue)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
              {unpaidPayments.length} pending
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pending Amount
          </p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {formatPrice(totalPending)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
              all time
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Transactions
          </p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {payments.length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
              {failedPayments.length} failed
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Failed Payments
          </p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {failedPayments.length}
          </p>
        </div>
      </div>

      {/* Unpaid */}
      {unpaidPayments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Awaiting Payment
            </h3>
          </div>
          {unpaidPayments.map((p: any) => (
            <PaymentRow key={p.id} payment={p} />
          ))}
        </div>
      )}

      {/* Paid */}
      {paidPayments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Received Payments
          </h3>
          {paidPayments.map((p: any) => (
            <PaymentRow key={p.id} payment={p} showInvoice />
          ))}
        </div>
      )}

      {/* Failed */}
      {failedPayments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Failed Payments
          </h3>
          {failedPayments.map((p: any) => (
            <PaymentRow key={p.id} payment={p} />
          ))}
        </div>
      )}

      {/* Empty */}
      {payments.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No payments yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Payments will appear once your bookings are confirmed
          </p>
        </div>
      )}
    </div>
  );
}

function PaymentRow({
  payment,
  showInvoice,
}: {
  payment: any;
  showInvoice?: boolean;
}) {
  const amount = payment.totalAmount || payment.amount || 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-700">
          {payment.listing?.images?.[0]?.url ? (
            <Image
              src={payment.listing.images[0].url}
              alt={payment.listing?.title || "Listing"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Receipt className="w-5 h-5 text-slate-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {payment.booking?.listing?.title ||
                  payment.listing?.title ||
                  "Listing"}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tenant:{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {payment.booking?.student?.name ||
                    payment.student?.name ||
                    "—"}
                </span>
              </p>
            </div>
            <span
              className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
            >
              {payment.status}
            </span>
          </div>

          {payment.transactionId && (
            <p className="text-xs text-slate-400 font-mono mb-2">
              TXN: {payment.transactionId}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <div>
              <span className="text-xs text-slate-400">Base</span>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {formatPrice(payment.baseAmount || payment.amount || 0)}
              </p>
            </div>
            {payment.extraCharges?.length > 0 && (
              <div>
                <span className="text-xs text-slate-400">Extras</span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  +
                  {formatPrice(
                    payment.extraCharges.reduce(
                      (s: number, e: any) => s + e.amount,
                      0
                    )
                  )}
                </p>
              </div>
            )}
            <div>
              <span className="text-xs text-slate-400">Total</span>
              <p className="text-lg font-bold text-emerald-600">
                {formatPrice(amount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          {payment.paidAt ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Paid on {formatDate(payment.paidAt)}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              {payment.daysWaiting != null
                ? `${payment.daysWaiting}d waiting`
                : "Awaiting payment"}
            </span>
          )}
        </div>

        {showInvoice && payment.id && (
          <InvoiceDownloadButton paymentId={payment.id} />
        )}
      </div>
    </div>
  );
}