"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import browserClient from "@/lib/browserClient";
import { IPayment } from "@/types/payment.types";
import PaymentHistory from "./PaymentHistory";

export default function MyPaymentsPageContent() {
  const { isLoading: authLoading } = useAuth();
  const [payments, setPayments] = useState<IPayment[]>([]);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Payments</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your rent payments and download invoices
        </p>
      </div>

      <PaymentHistory payments={payments} />
    </div>
  );
}
