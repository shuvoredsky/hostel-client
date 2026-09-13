"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useSettings } from "@/providers/SettingsProvider";
import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/modules/Dashboard/DashboardNavbar";
import LogoLoaderClient from "@/components/shared/LogoLoaderClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const settings = useSettings();
  const logo = settings?.logoUrl || null;

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <DashboardSidebar user={user} logo={logo} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar user={user} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}