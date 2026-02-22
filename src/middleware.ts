import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth middleware — route protection based on session cookie presence.
 *
 * Rules:
 *  - Unauthenticated user visiting /workspace → redirect to /
 *  - Authenticated user visiting / → redirect to /workspace
 *  - Everything else passes through unchanged
 *
 * Better Auth sets `better-auth.session_token` (or the __Secure- prefixed
 * variant on HTTPS). Checking cookie existence is enough for a fast edge
 * redirect; the actual session validity is verified by Better Auth on the
 * server when the workspace page loads.
 */

const SESSION_COOKIE = "better-auth.session_token";
const SECURE_SESSION_COOKIE = "__Secure-better-auth.session_token";

function hasSession(request: NextRequest): boolean {
    return (
        request.cookies.has(SESSION_COOKIE) ||
        request.cookies.has(SECURE_SESSION_COOKIE)
    );
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authenticated = hasSession(request);

    // Unauthenticated → block /workspace, send to landing
    if (pathname.startsWith("/workspace") && !authenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Authenticated → skip landing page, go straight to workspace
    if (pathname === "/" && authenticated) {
        return NextResponse.redirect(new URL("/workspace", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/workspace/:path*"],
};
