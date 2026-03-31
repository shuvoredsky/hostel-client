"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/modules/Dashboard/DashboardNavbar";
import browserClient from "@/lib/browserClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await browserClient.get("/settings");
        const logoUrl = response?.data?.data?.settings?.logoUrl || null;
        setLogo(logoUrl);
      } catch {
        setLogo(null);
      }
    };
    fetchLogo();
  }, []);

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