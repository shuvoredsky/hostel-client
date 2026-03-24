"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import browserClient from "@/lib/browserClient";

export default function BookingStatusButtons({
  bookingId,
}: {
  bookingId: string;
}) {
  const [loading, setLoading] = useState<"ACCEPTED" | "REJECTED" | null>(null);
  const router = useRouter();

  const handleStatus = async (status: "ACCEPTED" | "REJECTED") => {
    setLoading(status);
    try {
      await browserClient.patch(`/bookings/owner/${bookingId}/status`, {
        status,
      });
      toast.success(
        status === "ACCEPTED" ? "Booking accepted!" : "Booking rejected"
      );
      router.refresh();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to update booking";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleStatus("REJECTED")}
        disabled={loading !== null}
        className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading === "REJECTED" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <XCircle className="w-3.5 h-3.5" />
        )}
        Reject
      </button>

      <button
        onClick={() => handleStatus("ACCEPTED")}
        disabled={loading !== null}
        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading === "ACCEPTED" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <CheckCircle className="w-3.5 h-3.5" />
        )}
        Accept
      </button>
    </div>
  );
}