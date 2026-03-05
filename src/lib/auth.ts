/**
 * Auth Server — Better Auth instance with pg Pool adapter
 * Supports email/password, Google OAuth, and GitHub OAuth
 */

import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({ connectionString: process.env.DATABASE_URL }),

    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: ["https://codealchemist-theta.vercel.app"],
    trustHost: true,

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },

    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,
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

export type Session = typeof auth.$Infer.Session;
