import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Google Fonts (Optimized by Next.js)
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-space",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: "CodeAlchemist — Turn Code into Craft",
    description: "Master Python, Rust, and TypeScript through interactive exercises. From zero to confident developer with AI-powered hints and real-time execution.",
    keywords: [
        "coding",
        "programming",
        "Python",
        "Rust",
        "TypeScript",
        "learn to code",
        "interactive coding",
        "AI hints",
    ],
    openGraph: {
        title: "CodeAlchemist — Turn Code into Craft",
        description: "Master Python, Rust, and TypeScript through interactive exercises.",
        url: "https://codealchemist.com",
        siteName: "CodeAlchemist",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "CodeAlchemist — Turn Code into Craft",
        description: "Master Python, Rust, and TypeScript through interactive exercises.",
    },
};

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
                {children}
            </body>
        </html>
    );
}