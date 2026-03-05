import MarketingNav from "@/components/marketing/MarketingNav";
import HeroSection from "@/components/marketing/HeroSection";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";
import LanguagesSection from "@/components/marketing/LanguagesSection";
import StatsSection from "@/components/marketing/StatsSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import PricingSection from "@/components/marketing/PricingSection";
import FAQSection from "@/components/marketing/FAQSection";
import CTABannerSection from "@/components/marketing/CTABannerSection";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default function MarketingPage() {
    return (
        <>
            <MarketingNav />
            <main>
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <LanguagesSection />
                <StatsSection />
                <TestimonialsSection />
                <PricingSection />
                <FAQSection />
                <CTABannerSection />
            </main>
            <MarketingFooter />
        </>
    );
}