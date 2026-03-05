import Link from "next/link";
import UserMenu from "@/components/auth/UserMenu";

export function DashboardHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <span className="text-2xl">⚗️</span>
                        <span className="font-bold text-gold text-lg">CodeAlchemist</span>
                    </Link>

                    {/* User Menu */}
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}