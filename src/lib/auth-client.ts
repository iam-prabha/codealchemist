/**
 * Auth Client — Better Auth React client for client-side auth operations
 */

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
