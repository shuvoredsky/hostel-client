"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ChangePasswordButton() {
  return (
    <Link
      href="/change-password"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "rounded-xl gap-2"
      )}
    >
      <Settings className="w-4 h-4" />
      Change Password
    </Link>
  );
}