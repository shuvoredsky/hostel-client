"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/modules/Dashboard/DashboardNavbar";

export default function DashboardLayout({
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <DashboardSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar user={user} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}