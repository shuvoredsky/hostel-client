"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import LogoLoaderClient from "@/components/shared/LogoLoaderClient";

export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login?redirect=/tenant/dashboard");
      return;
    }
    if (user.role !== "TENANT") {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LogoLoaderClient fullScreen={true} size="md" />;
  }

  if (!user || user.role !== "TENANT") return null;

  return <>{children}</>;
}
