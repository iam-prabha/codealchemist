"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AuthCardProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    footer?: ReactNode;
}

export default function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md"
        >
            <div className="glass-card p-8 rounded-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        {title}
                    </h1>
                    <p className="text-text-muted">
                        {subtitle}
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="mt-8 pt-6 border-t border-border">
                        {footer}
                    </div>
                )}
            </div>
        </motion.div>
    );
}