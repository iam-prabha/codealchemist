"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface HintsAccordionProps {
    hints: string[];
}

export default function HintsAccordion({ hints }: HintsAccordionProps) {
    return (
        <Accordion.Root type="multiple" className="space-y-2">
            <Accordion.Item value="hints" className="border border-border rounded-xl overflow-hidden">
                <Accordion.Header>
                    <Accordion.Trigger className="group flex items-center justify-between w-full px-4 py-3 bg-panel hover:bg-panel/80 transition-colors text-left">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-accent-blue" />
                            <span className="text-sm font-medium text-text-primary">
                                Show hints ({hints.length})
                            </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-text-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="px-4 py-3 bg-background border-t border-border">
                        <ul className="space-y-2">
                            {hints.map((hint, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-2 text-sm text-text-muted"
                                >
                                    <span className="text-accent-blue font-mono shrink-0">
                                        {index + 1}.
                                    </span>
                                    <span>{hint}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    );
}
