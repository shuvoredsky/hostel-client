"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CreateListingButton() {
  return (
    <Link
      href="/owner/create-listing"
      className={cn(
        buttonVariants({ size: "sm" }),
        "bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
      )}
    >
      <PlusCircle className="w-4 h-4" />
      Create Listing
    </Link>
  );
}