"use client";

import { motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";

interface XPBadgeProps {
    xp?: number;
    streak?: number;
}

export default function XPBadge({ xp = 180, streak = 7 }: XPBadgeProps) {
    return (
        <motion.div
            className="flex items-center justify-between p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {/* XP */}
            <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
            >
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-gold" />
                </div>
                <div>
                    <div className="text-lg font-bold text-gold">{xp} XP</div>
                    <div className="text-xs text-text-muted">Total XP</div>
                </div>
            </motion.div>

            {/* Streak */}
            <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
            >
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                    <div className="text-lg font-bold text-orange-500">{streak}</div>
                    <div className="text-xs text-text-muted">Day Streak</div>
                </div>
            </motion.div>
        </motion.div>
    );
}
