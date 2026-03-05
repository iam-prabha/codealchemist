"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { User, BookOpen, Play } from "lucide-react";

const steps = [
    {
        icon: User,
        number: 1,
        title: "Choose Your Language",
        description: "Pick from Python, Rust, or TypeScript. Each language has its own learning path tailored to its unique features and use cases.",
    },
    {
        icon: BookOpen,
        number: 2,
        title: "Follow Guided Layers",
        description: "Work through 12 progressive topic layers, from variables to advanced concepts. Each layer builds on the previous one.",
    },
    {
        icon: Play,
        number: 3,
        title: "Transmute Code",
        description: "Write code, transmute it instantly, and see the results. Get AI hints when stuck and track your progress with XP.",
    },
];

export default function HowItWorksSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section id="how-it-works" className="py-24 px-4 bg-surface/30">
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
                        From zero to confident in 3 steps
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Our proven learning methodology takes you from complete beginner to
                        confident developer through structured, hands-on practice.
                    </p>
                </motion.div>

                {/* Steps */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="relative"
                >
                    {/* Desktop Layout */}
                    <div className="hidden lg:block">
                        <div className="grid grid-cols-3 gap-8 relative">
                            {/* Connecting line */}
                            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
                                <div className="flex justify-between items-center">
                                    <div className="w-1/3 h-0.5 bg-gradient-to-r from-transparent to-gold" />
                                    <div className="w-1/3 h-0.5 bg-gradient-to-r from-gold to-gold" />
                                    <div className="w-1/3 h-0.5 bg-gradient-to-l from-transparent to-gold" />
                                </div>
                            </div>

                            {steps.map((step, _index) => (
                                <motion.div
                                    key={step.number}
                                    variants={itemVariants}
                                    className="text-center relative"
                                >
                                    {/* Step Circle */}
                                    <div className="relative mb-8">
                                        <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                                            <step.icon className="w-8 h-8 text-text-inverse" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-text-inverse font-bold text-sm">
                                            {step.number}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-text-muted leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile/Tablet Layout */}
                    <div className="lg:hidden space-y-12">
                        {steps.map((step, _index) => (
                            <motion.div
                                key={step.number}
                                variants={itemVariants}
                                className="flex flex-col md:flex-row md:items-center gap-6"
                            >
                                {/* Step Circle */}
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center relative">
                                        <step.icon className="w-8 h-8 text-text-inverse" />
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-text-inverse font-bold text-sm">
                                            {step.number}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-text-muted leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}