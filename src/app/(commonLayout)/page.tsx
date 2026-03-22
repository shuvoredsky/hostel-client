import { getSiteSettings } from "@/services/settings.services";
import HeroBanner from "@/components/modules/Home/HeroBanner";
import FeaturedListings from "@/components/modules/Home/FeaturedListings";
import HowItWorks from "@/components/modules/Home/HowItWorks";

export default async function HomePage() {
  let settings = null;

  try {
    const response = await getSiteSettings();
    settings = response?.data || null;
  } catch {
    settings = null;
  }

  return (
    <main>
      <HeroBanner banners={settings?.banners || []} />
      <FeaturedListings />
      <HowItWorks />
    </main>
  );
}