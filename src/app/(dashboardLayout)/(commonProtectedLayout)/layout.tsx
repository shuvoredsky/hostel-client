"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import LogoLoaderClient from "@/components/shared/LogoLoaderClient";

export default function CommonProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LogoLoaderClient fullScreen={true} size="md" />;
  }

  if (!user) return null;

  return <>{children}</>;
}