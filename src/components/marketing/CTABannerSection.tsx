"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function CTABannerSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-16 px-4">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto text-center"
            >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 rounded-2xl" />

                <div className="relative glass-card px-8 py-12 rounded-2xl">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Ready to start your coding journey?
                    </h2>
                    <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
                        Join thousands of developers who are mastering new languages with CodeAlchemist.
                        Your first coding lesson is just one click away.
                    </p>
                    <Link
                        href="/sign-up"
                        className="inline-flex items-center px-8 py-4 bg-gold hover:bg-gold/90 text-text-inverse rounded-full font-semibold text-lg transition-colors"
                    >
                        Create Free Account
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}