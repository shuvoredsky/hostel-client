"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import browserClient from "@/lib/browserClient";

export default function DeleteListingButton({
  listingId,
}: {
  listingId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    setLoading(true);
    try {
      await browserClient.delete(`/listings/owner/${listingId}`);
      toast.success("Listing deleted successfully");
      router.refresh();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to delete listing";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      title="Delete listing"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}