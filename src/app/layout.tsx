import type { Metadata, Viewport } from "next";
import { Cinzel, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ── Google Fonts (Optimized by Next.js) ────────────────────────
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
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
    themeColor: "#05050F",
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
            <body className={`${cinzel.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
