"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import AuthCard from "./AuthCard";
import OAuthButtons from "./OAuthButtons";
import PasswordInput from "./PasswordInput";
import AuthDivider from "./AuthDivider";
import AuthError from "./AuthError";
import { Loader2 } from "lucide-react";

export default function SignInForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn.email({
                email: formData.email,
                password: formData.password,
                callbackURL: "/dashboard",
            });

            if (result.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
            }
        } catch (_err) {
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
            title="Welcome back"
            subtitle="Sign in to continue your journey"
            footer={
                <p className="text-center text-sm text-text-muted">
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="text-gold hover:underline font-medium">
                        Sign up →
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* OAuth Buttons */}
                <OAuthButtons />
                <AuthDivider />

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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange("password")}
                />

                {/* Error Message */}
                {error && <AuthError message={error} />}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold hover:bg-gold/90 text-text-inverse rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Sign In
                </button>
            </form>
        </AuthCard>
    );
}