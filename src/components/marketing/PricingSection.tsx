"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as Switch from "@radix-ui/react-switch";
import Link from "next/link";
import { Check, Star } from "lucide-react";

const plans = [
    {
        name: "Free",
        price: { monthly: 0, yearly: 0 },
        popular: false,
        features: [
            "3 Languages (Python, Rust, TypeScript)",
            "Layer 1–3 access",
            "Basic exercises",
            "Community support",
            "Progress tracking",
        ],
        cta: "Get Started Free",
        href: "/sign-up",
    },
    {
        name: "Pro",
        price: { monthly: 12, yearly: 9.6 },
        popular: true,
        features: [
            "All 12 Layers unlocked",
            "Unlimited AI hints",
            "Challenge mode",
            "Priority support",
            "Advanced analytics",
            "Custom exercises",
        ],
        cta: "Upgrade to Pro",
        href: "/sign-up?plan=pro",
    },
];

export default function PricingSection() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section id="pricing" className="py-24 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto mb-8">
                        Choose the plan that fits your learning journey.
                        Upgrade or downgrade at any time.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm ${!isYearly ? "text-text-primary font-medium" : "text-text-muted"}`}>
                            Monthly
                        </span>
                        <Switch.Root
                            checked={isYearly}
                            onCheckedChange={setIsYearly}
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface border border-border"
                        >
                            <Switch.Thumb className="inline-block h-4 w-4 transform rounded-full bg-gold transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1" />
                        </Switch.Root>
                        <span className={`text-sm ${isYearly ? "text-text-primary font-medium" : "text-text-muted"}`}>
                            Yearly
                            <span className="ml-2 px-2 py-1 bg-gold/20 text-gold text-xs rounded-full font-medium">
                                Save 20%
                            </span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`relative glass-card p-8 rounded-xl ${
                                plan.popular
                                    ? "border-gold/50 shadow-lg shadow-gold/10 scale-105"
                                    : "border-border/50"
                            }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <div className="flex items-center gap-1 px-3 py-1 bg-gold text-text-inverse text-xs font-medium rounded-full">
                                        <Star className="w-3 h-3" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Header */}
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="text-4xl font-bold text-gold mb-1">
                                    ${plan.price[isYearly ? "yearly" : "monthly"]}
                                    {plan.price.monthly > 0 && (
                                        <span className="text-lg text-text-muted">
                                            /{isYearly ? "mo" : "month"}
                                        </span>
                                    )}
                                </div>
                                {isYearly && plan.price.monthly > 0 && (
                                    <div className="text-sm text-text-muted">
                                        Billed annually at ${(plan.price.monthly * 12 * 0.8).toFixed(0)}
                                    </div>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center gap-3">
                                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Link
                                href={plan.href}
                                className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                                    plan.popular
                                        ? "bg-gold hover:bg-gold/90 text-text-inverse"
                                        : "bg-surface hover:bg-panel text-text-primary border border-border"
                                }`}
                            >
                                {plan.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center mt-12">
                    <p className="text-sm text-text-muted">
                        All plans include a 30-day money-back guarantee.
                        <br />
                        Questions? <a href="mailto:support@codealchemist.com" className="text-gold hover:underline">Contact support</a>
                    </p>
                </div>
            </div>
        </section>
    );
}