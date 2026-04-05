import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { getSiteSettings } from "@/services/settings.services";

export const revalidate = 0;

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let logo = null;

  try {
    const response = await getSiteSettings();
    logo = response?.data?.settings?.logoUrl || null;
  } catch {
    logo = null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar logo={logo} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}