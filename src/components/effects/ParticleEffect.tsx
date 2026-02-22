"use client";

/**
 * ParticleEffect — Floating alchemical particles in the background
 * Pure CSS animation approach. Rendered client-side only to avoid hydration mismatch.
 */

import { useState, useEffect } from "react";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    duration: number;
    delay: number;
    driftX: number;
}

const PARTICLE_COLORS = [
    "#f5c542",   // gold
    "#00f0ff",   // cyan
    "#ff00ff",   // magenta
    "#c49b30",   // gold-dim
];

export default function ParticleEffect({ count = 20 }: { count?: number }) {
    const [particles, setParticles] = useState<Particle[]>([]);

    // Generate particles only on the client after mount — avoids hydration mismatch
    useEffect(() => {
        setParticles(
            Array.from({ length: count }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 3 + 1,
                color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
                duration: Math.random() * 8 + 6,
                delay: Math.random() * 4,
                driftX: Math.random() > 0.5 ? 15 : -15,
            }))
        );
    }, [count]);

    if (particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full particle-float"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                        opacity: 0.3,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                        // @ts-expect-error CSS custom properties for animation
                        "--drift-x": `${p.driftX}px`,
                    }}
                />
            ))}

            <style jsx>{`
        .particle-float {
          animation: particleFloat var(--duration, 8s) ease-in-out infinite;
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-30px) translateX(var(--drift-x, 15px));
            opacity: 0.5;
          }
        }
      `}</style>
        </div>
    );
}
