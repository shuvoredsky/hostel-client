"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Ban, Home, RefreshCw, CreditCard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// ✅ useSearchParams আলাদা component এ নিয়ে Suspense দিয়ে wrap করো
function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get("transactionId");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-xl border border-slate-200 dark:border-slate-700"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6"
      >
        <Ban className="w-12 h-12 text-amber-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Payment Cancelled
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          You cancelled the payment. Your booking is still pending — you can
          pay anytime from your payments page.
        </p>

        {transactionId && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 mb-6">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Transaction ID
            </p>
            <p className="text-sm font-mono font-medium text-amber-600 dark:text-amber-400 break-all">
              {transactionId}
            </p>
          </div>
        )}

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            What happens now?
          </p>
          <ul className="space-y-1.5">
            {[
              "Your booking request is still active",
              "You can retry payment from My Payments",
              "No charges have been made to your account",
            ].map((info) => (
              <li
                key={info}
                className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                {info}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/student/my-payments"
            className={cn(
              buttonVariants({ size: "lg" }),
              "flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            )}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Go to Payments
          </Link>
          <button
            onClick={() => router.back()}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "flex-1"
            )}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 mt-4 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 dark:from-slate-950 dark:to-amber-950/20 flex items-center justify-center px-4">
      {/* ✅ Suspense দিয়ে wrap করো */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      }>
        <PaymentCancelContent />
      </Suspense>
    </div>
  );
} 