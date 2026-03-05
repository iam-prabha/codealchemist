"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import AuthCard from "./AuthCard";
import OAuthButtons from "./OAuthButtons";
import PasswordInput from "./PasswordInput";
import AuthDivider from "./AuthDivider";
import AuthError from "./AuthError";
import { Loader2 } from "lucide-react";

export default function SignUpForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!acceptedTerms) {
            setError("Please accept the Terms of Service and Privacy Policy");
            return;
        }

        setIsLoading(true);

        try {
            const result = await signUp.email({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                callbackURL: "/dashboard",
            });

            if (result.error) {
                setError("Failed to create account. Please try again.");
            } else {
                router.push("/dashboard");
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError("");
    };

    return (
        <AuthCard
            title="Create your account"
            subtitle="Start your coding journey for free"
            footer={
                <p className="text-center text-sm text-text-muted">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-gold hover:underline font-medium">
                        Sign in →
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* OAuth Buttons */}
                <OAuthButtons />
                <AuthDivider />

                {/* Name Input */}
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-text-primary">
                        Full Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name")(e.target.value)}
                        className={`w-full px-4 py-3 bg-surface border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold/50 transition-colors ${
                            error ? "border-red-500" : "border-border"
                        }`}
                        required
                    />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-text-primary">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email")(e.target.value)}
                        className={`w-full px-4 py-3 bg-surface border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold/50 transition-colors ${
                            error ? "border-red-500" : "border-border"
                        }`}
                        required
                    />
                </div>

                {/* Password Input */}
                <PasswordInput
                    id="password"
                    label="Password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    showStrength
                />

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                    <input
                        id="terms"
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-gold bg-surface border-border rounded focus:ring-gold/50"
                    />
                    <label htmlFor="terms" className="text-sm text-text-muted leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-gold hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-gold hover:underline">
                            Privacy Policy
                        </Link>
                    </label>
                </div>

                {/* Error Message */}
                {error && <AuthError message={error} />}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold hover:bg-gold/90 text-text-inverse rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create Account
                </button>
            </form>
        </AuthCard>
    );
}