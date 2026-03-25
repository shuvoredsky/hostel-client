"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ViewDetailsButtonProps {
  listingId: string;
}

export default function ViewDetailsButton({ listingId }: ViewDetailsButtonProps) {
  return (
    <Link
      href={`/listings/${listingId}`}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "text-xs rounded-lg"
      )}
    >
      View Details
    </Link>
  );
}