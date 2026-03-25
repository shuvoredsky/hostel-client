import { getMe } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const response = await getMe();
    const user = response?.data;

    if (!user || user.role !== "ADMIN") {
      redirect("/login");
    }
  } catch {
    redirect("/login");
  }

  return <>{children}</>;
}