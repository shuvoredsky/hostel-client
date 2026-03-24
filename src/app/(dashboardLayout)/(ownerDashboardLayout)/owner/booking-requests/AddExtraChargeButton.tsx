"use client";

import { useState } from "react";
import { PlusCircle, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import browserClient from "@/lib/browserClient";

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Enter a valid amount"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddExtraChargeButton({
  bookingId,
}: {
  bookingId: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await browserClient.post(`/bookings/${bookingId}/extra-charge`, {
        title: data.title,
        amount: Number(data.amount),
        description: data.description || "",
      });
      toast.success("Extra charge added");
      reset();
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to add extra charge";
      toast.error(message);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
      >
        <PlusCircle className="w-3.5 h-3.5" />
        Extra Charge
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Add Extra Charge
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Title
                </label>
                <input
                  {...register("title")}
                  placeholder="e.g. Electricity Bill"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Amount (BDT)
                </label>
                <input
                  {...register("amount")}
                  type="number"
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                {errors.amount && (
                  <p className="text-xs text-red-500">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  {...register("description")}
                  rows={2}
                  placeholder="Additional notes..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add Charge"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}