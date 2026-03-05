"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import AuthError from "@/components/auth/AuthError";

const errorMessages: Record<string, string> = {
    OAuthAccountNotLinked: "This email is linked to a different sign-in method",
    OAuthCallbackError: "OAuth failed. Please try again.",
    CredentialsSignin: "Incorrect email or password",
    SessionRequired: "Please sign in to continue",
    Default: "Something went wrong. Please try again.",
};

export default function AuthErrorPageContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <AuthCard
                title="Authentication Error"
                subtitle="We encountered a problem while signing you in"
                footer={
                    <div className="flex justify-center gap-6 text-sm">
                        <Link
                            href="/sign-in"
                            className="text-gold hover:underline font-medium"
                        >
                            Back to Sign In
                        </Link>
                        <Link
                            href="/"
                            className="text-text-muted hover:text-text-primary"
                        >
                            Back to Home
                        </Link>
                    </div>
                }
            >
                <AuthError message={errorMessage} />
            </AuthCard>
        </div>
    );
}