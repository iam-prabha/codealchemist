/**
 * Auth Client — Better Auth React client for client-side auth operations
 */

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // Hardcode the production URL as a fallback so we don't strictly require a NEXT_PUBLIC env var
    baseURL: process.env.NODE_ENV === "development" 
        ? "http://localhost:3000" 
        : "https://codealchemist-theta.vercel.app",
});

export const { signIn, signUp, signOut, useSession } = authClient;
