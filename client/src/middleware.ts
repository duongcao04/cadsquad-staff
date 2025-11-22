import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

// NOTE: Assuming routing includes { locales: [...], defaultLocale: 'en' }
import { routing } from '@/i18n/routing'
import { getLocale, removeLocale } from './i18n/utils'
import { authApi } from './lib/api'

export const publicRoutes = ['/auth']

const intlMiddleware = createIntlMiddleware(routing)

/**
 * Redirects the user to the authentication page, preserving the current path
 * in a 'redirect' query parameter after removing the locale prefix.
 */
function redirectToAuth(request: NextRequest, pathname: string) {
    // Determine the locale to use for the auth page.
    // If the path has a locale (/vi/protected), use that. 
    // Otherwise, fall back to the app's default locale (e.g., 'en').
    const authLocale = getLocale(pathname) || routing.defaultLocale;

    // Get the protected route the user was trying to access (e.g., /protected/page)
    const protectedPath = removeLocale(pathname);

    // Construct the new auth URL with the correct locale prefix
    const authUrl = new URL(`/${authLocale}/auth`, request.url);

    // Set the redirect query parameter to the protected path, but only if it's not the root path
    if (protectedPath !== '/' && protectedPath !== '/en') {
        authUrl.searchParams.set('redirect', protectedPath);
    }

    return NextResponse.redirect(authUrl);
}

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Helper to check if the route (without locale prefix) is public
    const isPublicRoute = (path: string) => publicRoutes.includes(removeLocale(path))

    // Get the token from the cookie
    const token = request.cookies.get('authentication')?.value

    // 1. Handle all requests to public routes
    if (isPublicRoute(pathname)) {
        // Public routes are always passed to intlMiddleware to handle locale detection/redirection
        return NextResponse.next()
    }

    // 2. Handle requests to protected routes without a token
    if (!token) {
        return redirectToAuth(request, pathname)
    }

    // 3. Handle requests to protected routes with a token (Validation step)

    // FIX: Pass the token value retrieved from the cookie to the validation function.
    // Assuming authApi.validateToken is an async function that accepts the JWT string.
    let isTokenValid = false;
    try {
        isTokenValid = await authApi.validateToken(token)
    } catch (e) {
        // Log the error but treat validation failure as an invalid token
        console.error("Token validation failed:", e);
    }

    if (!isTokenValid) {
        // Token exists but is invalid, expired, or failed validation
        return redirectToAuth(request, pathname)
    }

    // 4. Token is valid, proceed with i18n middleware for protected content
    return intlMiddleware(request)
}

export const config = {
    matcher: [
        // Match EVERYTHING except _next static files and assets
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
}
