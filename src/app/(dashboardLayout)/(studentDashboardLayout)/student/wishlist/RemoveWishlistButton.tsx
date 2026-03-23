"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import browserClient from "@/lib/browserClient";

interface RemoveWishlistButtonProps {
  listingId: string;
}

export default function RemoveWishlistButton({
  listingId,
}: RemoveWishlistButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      await browserClient.post(`/wishlist/toggle/${listingId}`);
      toast.success("Removed from wishlist");
      router.refresh();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to remove from wishlist";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      title="Remove from wishlist"
      className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 text-rose-500 animate-spin" />
      ) : (
        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
      )}
    </button>
  );
}