import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

import { removeLocaleFromPathname, routing } from './i18n/routing'

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing)

// Define public routes that don't require authentication
const publicRoutes = ['/auth']

function isPublicRoute(pathname: string): boolean {
    // Remove locale prefix to check the actual route
    const pathWithoutLocale = removeLocaleFromPathname(pathname)

    return publicRoutes.some(
        (route) =>
            pathWithoutLocale === route || pathWithoutLocale.startsWith(route)
    )
}

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if user has session cookie
    const sessionCookie = request.cookies.get('session')
    const hasSession = sessionCookie && sessionCookie.value

    // Extract locale from pathname or use default
    const locale = pathname.split('/')[1] || 'en'
    const isValidLocale = ['vi', 'en'].includes(locale)

    // If it's a protected route and user is not authenticated
    if (!isPublicRoute(pathname) && !hasSession) {
        // Redirect to auth page with proper locale
        const authUrl = new URL(
            `/${isValidLocale ? locale : 'en'}/auth`,
            request.url
        )

        const pathWithoutLocale = removeLocaleFromPathname(pathname)
        // Optionally add a redirect parameter to return after login
        authUrl.searchParams.set('redirect', pathWithoutLocale)

        return NextResponse.redirect(authUrl)
    }

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (hasSession && isPublicRoute(pathname) && pathname.includes('/auth')) {
        const dashboardUrl = new URL(
            `/${isValidLocale ? locale : 'en'}/`,
            request.url
        )
        return NextResponse.redirect(dashboardUrl)
    }

    // Apply internationalization middleware for all other cases
    return intlMiddleware(request)
}

export const config = {
    matcher: [
        // Enable a redirect to a matching locale at the root
        '/',

        // Set a cookie to remember the previous locale for
        // all requests that have a locale prefix
        '/(vi|en)/:path*',

        // Enable redirects that add missing locales
        // (e.g. `/pathnames` -> `/en/pathnames`)
        '/((?!_next|_vercel|.*\\..*).*)',
    ],
}
