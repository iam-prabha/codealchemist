import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Link from "next/link";

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
            <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
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