"use client"

import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  // NEXT_PUBLIC_APP_URL must equal the same value as BETTER_AUTH_URL
  // It exists as NEXT_PUBLIC_ so the browser bundle can access it
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient