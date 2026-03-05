"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
    id: string;
    label: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    showStrength?: boolean;
}

function getPasswordStrength(password: string) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: "weak", color: "bg-red-500", segments: 1 };
    if (score <= 3) return { level: "fair", color: "bg-yellow-500", segments: 2 };
    if (score <= 4) return { level: "good", color: "bg-blue-500", segments: 3 };
    return { level: "strong", color: "bg-green-500", segments: 4 };
}

export default function PasswordInput({
    id,
    label,
    placeholder = "Enter your password",
    value,
    onChange,
    error,
    showStrength = false,
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const strength = showStrength ? getPasswordStrength(value) : null;

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-sm font-medium text-text-primary">
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full px-4 py-3 bg-surface border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold/50 transition-colors ${
                        error ? "border-red-500" : "border-border"
                    }`}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                    ) : (
                        <Eye className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Password Strength Indicator */}
            {showStrength && value && (
                <div className="space-y-2">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map((segment) => (
                            <div
                                key={segment}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                    segment <= (strength?.segments || 0)
                                        ? strength?.color
                                        : "bg-border"
                                }`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-text-muted">
                        Password strength: <span className="capitalize">{strength?.level}</span>
                    </p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}