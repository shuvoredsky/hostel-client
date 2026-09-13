"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import LogoLoaderClient from "@/components/shared/LogoLoaderClient";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login?redirect=/student/dashboard");
      return;
    }
    if (user.role !== "STUDENT") {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LogoLoaderClient fullScreen={true} size="md" />;
  }

  if (!user || user.role !== "STUDENT") return null;

  return <>{children}</>;
}