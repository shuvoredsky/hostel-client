"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import browserClient from "@/lib/browserClient";
import { formatDate, formatPrice, getStatusColor } from "@/lib/utils";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  TrendingUp,
  Receipt,
  AlertCircle,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import PaymentInitiateButton from "./PaymentInitiateButton";
import InvoiceDownloadButton from "./InvoiceDownloadButton";

export default function MyPaymentsPage() {
  const { isLoading: authLoading } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await browserClient.get("/payments/my-payments");
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

  const totalPaid = paidPayments.reduce(
    (sum, p) => sum + (p.totalAmount || p.amount || 0),
    0
  );
  const totalDue = unpaidPayments.reduce(
    (sum, p) => sum + (p.totalAmount || p.amount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Payments
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your rent payments and download invoices
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Paid */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
              {paidPayments.length} paid
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Paid
          </p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {formatPrice(totalPaid)}
          </p>
        </div>

        {/* Total Due */}
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
            Total Due
          </p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {formatPrice(totalDue)}
          </p>
        </div>

        {/* Total Transactions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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

        {/* Failed */}
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

      {/* Unpaid Payments — Action Required */}
      {unpaidPayments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Action Required
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              — {unpaidPayments.length} payment{unpaidPayments.length !== 1 ? "s" : ""} pending
            </span>
          </div>

          <div className="space-y-3">
            {unpaidPayments.map((payment: any) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                showInitiate
              />
            ))}
          </div>
        </div>
      )}

      {/* Paid Payments */}
      {paidPayments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Payment History
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              — {paidPayments.length} completed
            </span>
          </div>

          <div className="space-y-3">
            {paidPayments.map((payment: any) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                showInvoice
              />
            ))}
          </div>
        </div>
      )}

      {/* Failed Payments */}
      {failedPayments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Failed Payments
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              — {failedPayments.length} failed
            </span>
          </div>

          <div className="space-y-3">
            {failedPayments.map((payment: any) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                showInitiate
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {payments.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No payments yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Payments will appear here once your bookings are confirmed
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Payment Card ──────────────────────────────────────────────────────────────

function PaymentCard({
  payment,
  showInitiate,
  showInvoice,
}: {
  payment: any;
  showInitiate?: boolean;
  showInvoice?: boolean;
}) {
  const amount = payment.totalAmount || payment.amount || 0;
  const hasExtraCharges =
    payment.extraCharges && payment.extraCharges.length > 0;
  const extraTotal = payment.extraCharges?.reduce(
    (sum: number, ec: any) => sum + ec.amount,
    0
  ) || 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row gap-4">
        {/* Icon / Image */}
        <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0">
          {payment.listing?.images?.[0]?.url ? (
            <Image
              src={payment.listing.images[0].url}
              alt={payment.listing?.title || "Listing"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-slate-400" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white leading-tight">
                {payment.booking?.listing?.title ||
                  payment.listing?.title ||
                  "Listing"}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {payment.booking?.listing?.area ||
                  payment.listing?.area ||
                  "—"}
                ,{" "}
                {payment.booking?.listing?.city ||
                  payment.listing?.city ||
                  "—"}
              </p>
            </div>
            <span
              className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
            >
              {payment.status}
            </span>
          </div>

          {/* Transaction ID */}
          {payment.transactionId && (
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mb-2">
              TXN: {payment.transactionId}
            </p>
          )}

          {/* Amount Breakdown */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <div>
              <span className="text-xs text-slate-400">Base rent</span>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {formatPrice(payment.baseAmount || payment.amount || 0)}
              </p>
            </div>
            {hasExtraCharges && (
              <div>
                <span className="text-xs text-slate-400">Extra charges</span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  +{formatPrice(extraTotal)}
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

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          {payment.paidAt ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Paid on {formatDate(payment.paidAt)}
            </span>
          ) : payment.createdAt ? (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Due since {formatDate(payment.createdAt)}
            </span>
          ) : null}

          {payment.daysWaiting != null && (
            <span className="text-amber-500 font-medium">
              {payment.daysWaiting}d overdue
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showInvoice && payment.id && (
            <InvoiceDownloadButton paymentId={payment.id} />
          )}
          {showInitiate && payment.bookingId && (
            <PaymentInitiateButton bookingId={payment.bookingId} />
          )}
        </div>
      </div>
    </div>
  );
}