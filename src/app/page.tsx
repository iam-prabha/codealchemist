"use client";

/**
 * CodeAlchemist — Landing Page
 * Public marketing page at /
 * The editor workspace lives at /workspace
 */

import { useState } from "react";
import ParticleEffect from "@/components/effects/ParticleEffect";
import AuthModal from "@/components/auth/AuthModal";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import LanguageShowcase from "@/components/landing/LanguageShowcase";
import Features from "@/components/landing/Features";
import CurriculumRoadmap from "@/components/landing/CurriculumRoadmap";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const handleGetStarted = () => setAuthModalOpen(true);

    return (
        <>
            {/* Background particles */}
            <ParticleEffect count={25} />

            {/* Full-width scrollable landing layout */}
            <div className="relative z-10 min-h-screen">
                <Navbar />
                <HeroSection onGetStarted={handleGetStarted} />
                <LanguageShowcase />
                <Features />
                <CurriculumRoadmap />
                <Footer onGetStarted={handleGetStarted} />
            </div>

            {/* Auth Modal */}
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </>
    );
}
