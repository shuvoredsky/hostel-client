"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import browserClient from "@/lib/browserClient";

export default function AdminListingActions({
  listingId,
}: {
  listingId: string;
}) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const router = useRouter();

  const handleAction = async (action: "approve" | "reject") => {
    setLoading(action);
    try {
      await browserClient.patch(`/listings/admin/${listingId}/${action}`);
      toast.success(
        action === "approve" ? "Listing approved!" : "Listing rejected"
      );
      router.refresh();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to update listing";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleAction("reject")}
        disabled={loading !== null}
        className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading === "reject" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <XCircle className="w-3.5 h-3.5" />
        )}
        Reject
      </button>
      <button
        onClick={() => handleAction("approve")}
        disabled={loading !== null}
        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading === "approve" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <CheckCircle className="w-3.5 h-3.5" />
        )}
        Approve
      </button>
    </div>
  );
}