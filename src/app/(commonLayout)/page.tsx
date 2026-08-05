import { Suspense } from "react";
import { getSiteSettings } from "@/services/settings.services";
import HeroBanner from "@/components/modules/Home/HeroBanner";
import FeaturedListings, { FeaturedListingsSkeleton } from "@/components/modules/Home/FeaturedListings";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import ProcessSteps from "@/components/modules/Home/ProcessSteps";
import VerifiedStudentSection from "@/components/modules/Home/VerifiedStudentSection";
import OwnerCTASection from "@/components/modules/Home/OwnerCTASection";
import FAQSection from "@/components/modules/Home/FAQSection";
import TrustStrip from "@/components/modules/Home/TrustStrip";
import StudentOffers from "@/components/modules/Home/StudentOffers";
import Testimonials from "@/components/modules/Home/Testimonials";

async function HeroSection() {
  let settings = null;
  try {
    const response = await getSiteSettings();
    settings = response?.data || null;
  } catch {
    settings = null;
  }
  return <HeroBanner banners={settings?.banners || []} />;
}

export default function HomePage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-[70vh] bg-slate-900 dark:bg-slate-950 animate-pulse" />}>
        <HeroSection />
      </Suspense>
      <TrustStrip />
      <Suspense fallback={<FeaturedListingsSkeleton />}>
        <FeaturedListings />
      </Suspense>
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