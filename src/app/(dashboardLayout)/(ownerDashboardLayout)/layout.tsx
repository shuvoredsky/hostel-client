"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import LogoLoaderClient from "@/components/shared/LogoLoaderClient";

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login?redirect=/owner/dashboard");
      return;
    }
    if (user.role !== "OWNER") {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LogoLoaderClient fullScreen={true} size="md" />;
  }

  if (!user || user.role !== "OWNER") return null;

  return <>{children}</>;
}