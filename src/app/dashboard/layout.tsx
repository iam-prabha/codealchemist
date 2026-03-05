import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

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
    title: "Dashboard — CodeAlchemist",
    description: "Your personal dashboard for mastering coding with CodeAlchemist.",
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <html lang="en" className="dark">
            <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
                <div className="min-h-screen bg-background text-text-primary">
                    {/* Background pattern */}
                    <div className="fixed inset-0 dot-grid opacity-20" />

                    {/* Dashboard Header */}
                    <DashboardHeader />

                    {/* Main Content */}
                    <main className="pt-16">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}