"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";
import browserClient from "@/lib/browserClient";

interface PaymentInitiateButtonProps {
  bookingId: string;
}

export default function PaymentInitiateButton({
  bookingId,
}: PaymentInitiateButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await browserClient.post(
        `/payments/initiate/${bookingId}`
      );
      const paymentUrl = response.data?.data?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error("Could not get payment URL. Please try again.");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Payment initiation failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-3.5 h-3.5" />
          Pay Now
        </>
      )}
    </button>
  );
}