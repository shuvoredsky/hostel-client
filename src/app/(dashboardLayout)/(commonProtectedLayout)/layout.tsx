import { getMe } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function CommonProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const response = await getMe();
    if (!response?.data) {
      redirect("/login");
    }
  } catch {
    redirect("/login");
  }

  return <>{children}</>;
}