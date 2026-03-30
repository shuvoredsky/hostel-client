"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Home, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const transactionId = searchParams.get("transactionId");
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/student/my-bookings");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-50 dark:from-emerald-950/20 dark:to-slate-950 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-xl border border-slate-200 dark:border-slate-700"
            >
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Payment Successful!
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                        Your booking has been confirmed. Welcome to your new home!
                    </p>

                    {transactionId && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 mb-6">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                Transaction ID
                            </p>
                            <p className="text-sm font-mono font-medium text-emerald-700 dark:text-emerald-400 break-all">
                                {transactionId}
                            </p>
                        </div>
                    )}

                    {/* Countdown */}
                    <p className="text-sm text-slate-400 mb-6">
                        Redirecting to bookings in{" "}
                        <span className="text-emerald-600 font-semibold">{countdown}s</span>
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/student/my-bookings"
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            )}
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            My Bookings
                        </Link>
                        <Link
                            href="/"
                            className={cn(
                                buttonVariants({ variant: "outline", size: "lg" }),
                                "flex-1"
                            )}
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Home
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}