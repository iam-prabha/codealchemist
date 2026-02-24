/**
 * Auth Server — Better Auth instance with Drizzle adapter
 * Supports email/password, Google OAuth, and GitHub OAuth
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),

    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: ["https://codealchemist-theta.vercel.app"],

    emailAndPassword: {
        enabled: true,
    },

    rateLimit: {
        window: 60, // 60 seconds
        max: 100, // max 100 requests per window per IP
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },

    user: {
        additionalFields: {
            xp: {
                type: "number",
                required: false,
                defaultValue: 0,
                input: false,
            },
            streak: {
                type: "number",
                required: false,
                defaultValue: 0,
                input: false,
            },
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
                input: false,
            },
        },
    },
});
