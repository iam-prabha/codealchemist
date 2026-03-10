"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "Is CodeAlchemist free to use?",
        answer: "Yes! CodeAlchemist is completely free to use. You have full access to all 12 layers of our comprehensive curriculum for Python, Rust, and TypeScript.",
    },
    {
        question: "Which programming languages are supported?",
        answer: "We support three languages: Python (great for beginners and data science), Rust (systems programming with memory safety), and TypeScript (modern web development with type safety). Each language has its own 12-layer curriculum.",
    },
    {
        question: "Do I need prior coding experience?",
        answer: "Not at all! CodeAlchemist is designed for complete beginners. Our guided learning approach starts with the absolute fundamentals and builds up progressively. Many developers have started their coding journey with us.",
    },
    {
        question: "How does the Transmute Engine work?",
        answer: "The Transmute Engine runs your code directly in the browser using WebAssembly and secure sandboxing. This allows for instant execution and feedback without needing to set up a local development environment.",
    },
    {
        question: "Can I switch between languages mid-course?",
        answer: "Absolutely! Your progress is saved separately for each language. You can work on Python exercises, then switch to Rust, and come back to Python later. Your XP and achievements carry across all languages.",
    },
    {
        question: "Is there a mobile app?",
        answer: "Currently, CodeAlchemist is a web-based platform optimized for desktop and tablet use. We're working on mobile apps, but the responsive web experience works great on mobile devices for reading and planning.",
    },
    {
        question: "How do AI hints work?",
        answer: "Our AI hints system analyzes your code and provides contextual help when you're stuck. Hints range from general guidance to specific code suggestions, helping you learn without giving away the solution.",
    },
    {
        question: "What's the difference between Guided and Challenge mode?",
        answer: "Guided mode provides step-by-step instructions and hints. Challenge mode removes the guidance and adds a time limit, perfect for testing your skills under pressure and building confidence for real-world coding scenarios.",
    },
];

export default function FAQSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="faq" className="py-24 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Frequently asked questions
                    </h2>
                    <p className="text-lg text-text-muted">
                        Everything you need to know about getting started with CodeAlchemist.
                    </p>
                </motion.div>

                {/* FAQ Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Accordion.Root type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <Accordion.Item
                                key={index}
                                value={`item-${index}`}
                                className="glass-card rounded-lg overflow-hidden"
                            >
                                <Accordion.Header>
                                    <Accordion.Trigger className="group flex items-center justify-between w-full px-6 py-4 text-left hover:bg-panel/50 transition-colors">
                                        <span className="font-medium text-text-primary pr-4">
                                            {faq.question}
                                        </span>
                                        <ChevronDown className="w-5 h-5 text-text-muted transition-transform duration-200 group-data-[state=open]:rotate-180 flex-shrink-0" />
                                    </Accordion.Trigger>
                                </Accordion.Header>
                                <Accordion.Content className="px-6 pb-4 text-text-muted leading-relaxed">
                                    {faq.answer}
                                </Accordion.Content>
                            </Accordion.Item>
                        ))}
                    </Accordion.Root>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <p className="text-text-muted mb-4">
                        Still have questions?
                    </p>
                    <a
                        href="mailto:support@codealchemist.com"
                        className="text-gold hover:underline font-medium"
                    >
                        Contact our support team →
                    </a>
                </motion.div>
            </div>
        </section>
    );
}