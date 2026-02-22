/**
 * Auth API Route — Catch-all handler for Better Auth
 * Handles all /api/auth/* requests (sign in, sign up, OAuth callbacks, etc.)
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Prevent Next.js from trying to statically pre-render this route
export const dynamic = "force-dynamic";

export const { POST, GET } = toNextJsHandler(auth);
