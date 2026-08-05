"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit3 } from "lucide-react";

interface EditListingButtonProps {
  listingId: string;
}

export default function EditListingButton({ listingId }: EditListingButtonProps) {
  return (
    <Link
      href={`/owner/my-listings/edit/${listingId}`}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "text-xs rounded-lg flex items-center gap-1.5 border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
      )}
    >
      <Edit3 className="w-3.5 h-3.5" />
      Edit
    </Link>
  );
}
