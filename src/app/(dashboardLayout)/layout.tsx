import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/modules/Dashboard/DashboardNavbar";
import { getMe } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;

  try {
    const response = await getMe();
    user = response?.data || null;
  } catch {
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <DashboardSidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar user={user} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}