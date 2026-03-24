import { getMe } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const response = await getMe();
    const user = response?.data;

    if (!user || user.role !== "OWNER") {
      redirect("/login");
    }
  } catch {
    redirect("/login");
  }

  return <>{children}</>;
}