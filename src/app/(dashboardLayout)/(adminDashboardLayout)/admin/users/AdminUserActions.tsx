"use client";

import { useState } from "react";
import { ShieldOff, ShieldCheck, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import browserClient from "@/lib/browserClient";

export default function AdminUserActions({
  userId,
  status,
  role,
}: {
  userId: string;
  status: string;
  role: string;
}) {
  const [loading, setLoading] = useState<"block" | "unblock" | "delete" | null>(null);
  const router = useRouter();

  const handleAction = async (action: "block" | "unblock" | "delete") => {
    setLoading(action);
    try {
      if (action === "delete") {
        await browserClient.delete(`/users/${userId}`);
        toast.success("User deleted");
      } else {
        await browserClient.patch(`/users/${userId}/${action}`);
        toast.success(action === "block" ? "User blocked" : "User unblocked");
      }
      router.refresh();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Action failed";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  // Don't show actions for admins
  if (role === "ADMIN") return null;

  return (
    <div className="flex items-center justify-end gap-2">
      {status === "ACTIVE" ? (
        <button
          onClick={() => handleAction("block")}
          disabled={loading !== null}
          className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading === "block" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ShieldOff className="w-3.5 h-3.5" />
          )}
          Block
        </button>
      ) : (
        <button
          onClick={() => handleAction("unblock")}
          disabled={loading !== null}
          className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading === "unblock" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5" />
          )}
          Unblock
        </button>
      )}
      <button
        onClick={() => handleAction("delete")}
        disabled={loading !== null}
        className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading === "delete" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
        Delete
      </button>
    </div>
  );
}