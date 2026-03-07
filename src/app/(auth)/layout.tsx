import type { Metadata } from "next";
import { Cinzel, DM_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";

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
    title: "Sign In — CodeAlchemist",
    description: "Sign in to continue your coding journey with CodeAlchemist.",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${cinzel.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
                <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-4">
                    {/* Background pattern */}
                    <div className="fixed inset-0 dot-grid opacity-20" />

                    {/* Logo */}
                    <Link
                        href="/"
                        className="fixed top-8 left-8 z-10 flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <span className="text-2xl">⚗️</span>
                        <span className="font-bold text-gold text-lg">CodeAlchemist</span>
                    </Link>

                    {children}
                </div>
            </body>
        </html>
    );
}