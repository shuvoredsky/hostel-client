"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BrowseListingsButton() {
  return (
    <Link
      href="/listings"
      className={cn(
        buttonVariants({ variant: "default", size: "sm" }),
        "bg-emerald-600 hover:bg-emerald-700"
      )}
    >
      Browse Listings
    </Link>
  );
}