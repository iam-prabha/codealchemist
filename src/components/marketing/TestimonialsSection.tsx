"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Full Stack Developer",
        company: "TechCorp",
        avatar: "SC",
        rating: 5,
        quote: "CodeAlchemist transformed how I learn. The interactive exercises and AI hints helped me go from Python beginner to confident developer in just 3 months.",
    },
    {
        name: "Marcus Rodriguez",
        role: "Systems Engineer",
        company: "CloudScale",
        avatar: "MR",
        rating: 5,
        quote: "Rust was intimidating until I found CodeAlchemist. The guided approach and real-time execution made complex concepts click. Now I write memory-safe code with confidence.",
    },
    {
        name: "Emma Thompson",
        role: "Frontend Developer",
        company: "StartupXYZ",
        avatar: "ET",
        rating: 5,
        quote: "TypeScript exercises here are phenomenal. The platform caught edge cases I never considered. My code is now bulletproof and I understand why types matter.",
    },
];

export default function TestimonialsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section className="py-24 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Developers love CodeAlchemist
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Join thousands of developers who&apos;ve accelerated their learning journey
                        with our interactive platform.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {testimonials.map((testimonial, _index) => (
                        <motion.div
                            key={testimonial.name}
                            variants={itemVariants}
                            className="glass-card p-6 rounded-xl hover:border-gold/20 transition-colors"
                        >
                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-gold text-gold"
                                    />
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="text-text-primary mb-6 leading-relaxed">
                                &ldquo;{testimonial.quote}&rdquo;
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="font-semibold text-text-primary">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-text-muted">
                                        {testimonial.role} at {testimonial.company}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}