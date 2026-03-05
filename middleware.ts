import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

const protectedRoutes = ["/dashboard", "/workspace"]
const authRoutes = ["/sign-in", "/sign-up"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedRoute = protectedRoutes.some(
    route => pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(
    route => pathname.startsWith(route)
  )

  // Skip middleware for non-relevant routes
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    // Authenticated user hitting auth pages → send to dashboard
    if (session && isAuthRoute) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      )
    }

    // Unauthenticated user hitting protected routes → send to sign-in
    if (!session && isProtectedRoute) {
      const signInUrl = new URL("/sign-in", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()

  } catch (error) {
    console.error("Middleware auth check failed:", error)

    // On error, only block protected routes — never block public pages
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
}