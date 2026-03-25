"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ViewListingButtonProps {
  listingId: string;
}

export default function ViewListingButton({ listingId }: ViewListingButtonProps) {
  return (
    <Link
      href={`/listings/${listingId}`}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "text-xs rounded-lg"
      )}
    >
      View Listing
    </Link>
  );
}