/**
 * Auth Client — Better Auth React client for client-side auth operations
 */

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // Tell the client exactly what URL it is operating on so it can formulate correct callback URLs
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "https://codealchemist-theta.vercel.app",
});

export const { signIn, signUp, signOut, useSession } = authClient;
