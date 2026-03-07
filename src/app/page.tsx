// src/app/page.tsx
import MarketingNav from "@/components/marketing/MarketingNav"
import HeroSection from "@/components/marketing/HeroSection"
import LanguagesSection from "@/components/marketing/LanguagesSection"
import FeaturesSection from "@/components/marketing/FeaturesSection"
import HowItWorksSection from "@/components/marketing/HowItWorksSection"
import StatsSection from "@/components/marketing/StatsSection"
import TestimonialsSection from "@/components/marketing/TestimonialsSection"
import FAQSection from "@/components/marketing/FAQSection"
import CTABannerSection from "@/components/marketing/CTABannerSection"
import MarketingFooter from "@/components/marketing/MarketingFooter"
import ParticleEffect from "@/components/effects/ParticleEffect"

export default async function LandingPage() {
  return (
    <>
      <ParticleEffect count={25} />
      <div className="relative z-10 min-h-screen">
        <MarketingNav />
        <HeroSection />
        <LanguagesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <TestimonialsSection />
        <FAQSection />
        <CTABannerSection />
        <MarketingFooter />
      </div>
    </>
  )
}
