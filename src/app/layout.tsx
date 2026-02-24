import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ── Google Fonts (Optimized by Next.js) ────────────────────────
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
    title: "CodeAlchemist — Transmute Code Into Mastery",
    description:
        "Transmute JavaScript fundamentals into Python, Rust & TypeScript mastery — with golden toggleable examples, real-time execution, and stunning debugging visualization.",
    keywords: [
        "learn programming",
        "Python",
        "Rust",
        "TypeScript",
        "code visualization",
        "interactive coding",
    ],
    manifest: "/manifest.json",
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: "#0a0612",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
                {children}
            </body>
        </html>
    );
}
