import { getSiteSettings } from "@/services/settings.services";
import HeroBanner from "@/components/modules/Home/HeroBanner";
import FeaturedListings from "@/components/modules/Home/FeaturedListings";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import ProcessSteps from "@/components/modules/Home/ProcessSteps";
import VerifiedStudentSection from "@/components/modules/Home/VerifiedStudentSection";
import OwnerCTASection from "@/components/modules/Home/OwnerCTASection";
import FAQSection from "@/components/modules/Home/FAQSection";
import TrustStrip from "@/components/modules/Home/TrustStrip";
import StudentOffers from "@/components/modules/Home/StudentOffers";
import Testimonials from "@/components/modules/Home/Testimonials";



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
      <TrustStrip />
      <FeaturedListings />
      <StudentOffers />
      <HowItWorks />
      <ProcessSteps />
      <VerifiedStudentSection />
      <OwnerCTASection />
      <FAQSection />
      <Testimonials />
    </main>
  );
}