"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, Home, RefreshCw, BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get("transactionId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-slate-50 dark:from-red-950/20 dark:to-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-xl border border-slate-200 dark:border-slate-700"
      >
        {/* Fail Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-12 h-12 text-red-500" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Payment Failed!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Something went wrong with your payment. Please try again.
          </p>

          {transactionId && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 mb-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Transaction ID
              </p>
              <p className="text-sm font-mono font-medium text-red-600 dark:text-red-400 break-all">
                {transactionId}
              </p>
            </div>
          )}

          {/* Possible Reasons */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Possible reasons:
            </p>
            <ul className="space-y-1">
              {[
                "Insufficient balance",
                "Card/account limit exceeded",
                "Network timeout",
                "Bank declined the transaction",
              ].map((reason) => (
                <li
                  key={reason}
                  className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.back()}
              className={cn(
                buttonVariants({ size: "lg" }),
                "flex-1 bg-red-500 hover:bg-red-600 text-white"
              )}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            <Link
              href="/student/my-payments"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "flex-1"
              )}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              My Payments
            </Link>
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
    </div>
  );
}