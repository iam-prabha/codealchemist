import type { Metadata, Viewport } from "next";
import "./globals.css";

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
            <head>
                {/* JetBrains Mono — Primary code font */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased">{children}</body>
        </html>
    );
}
