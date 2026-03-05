"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const initialStats = [
    { label: "Languages", value: 3, suffix: "" },
    { label: "Exercises", value: 120, suffix: "+" },
    { label: "Completion Rate", value: 98, suffix: "%" },
];

function AnimatedCounter({
    value,
    suffix,
    duration = 2000
}: {
    value: number;
    suffix: string;
    duration?: number;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(value * easeOutQuart));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isInView, value, duration]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}{suffix}
        </span>
    );
}

export default function StatsSection() {
    const [userCount, setUserCount] = useState(12000);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        // Fetch real user count
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                if (data.userCount) {
                    setUserCount(data.userCount);
                }
            })
            .catch(() => {
                // Keep fallback value
            });
    }, []);

    const stats = [
        { label: "Developers", value: userCount, suffix: "+" },
        ...initialStats,
    ];

    return (
        <section className="py-16 px-4 bg-surface/50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Background texture */}
                    <div className="dot-grid opacity-10 absolute inset-0" />

                    <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="space-y-2"
                            >
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-sm sm:text-base text-text-muted uppercase tracking-wide">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}