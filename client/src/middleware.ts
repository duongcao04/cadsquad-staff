import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

import { removeLocaleFromPathname, routing } from '@/i18n/routing'

// Public routes that don't require authentication
export const publicRoutes = ['auth']

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing)

function isPublicRoute(pathname: string): boolean {
    const pathWithoutLocale = removeLocaleFromPathname(pathname)
    return publicRoutes.some(
        (route) =>
            pathWithoutLocale === route || pathWithoutLocale.startsWith(route)
    )
}

export default async function middleware(request: NextRequest) {
    // Get current pathname
    const { pathname } = request.nextUrl

    // - Extract locale from pathname or use default
    const locale = pathname.split('/')[1]
    const isValidLocale = ['vi', 'en'].includes(locale)
    const finalLocale = isValidLocale ? locale : 'en'

    // - Check if user has session cookie
    const sessionCookie = request.cookies.get('session')?.value

    function redirectToAuth() {
        if (removeLocaleFromPathname(pathname) === '/auth') {
            return NextResponse.next()
        }
        const authUrl = new URL(`/${finalLocale}/auth`, request.url)
        authUrl.searchParams.set('redirect', removeLocaleFromPathname(pathname))
        return NextResponse.redirect(authUrl)
    }

    // Auth check for protected routes
    if (!isPublicRoute(pathname)) {
        if (!sessionCookie) {
            return redirectToAuth()
        } else {
            return NextResponse.next()
        }
    }

    // Fallback → apply i18n middleware
    return intlMiddleware(request)
}

export const config = {
    matcher: [
        // Match EVERYTHING except _next static files and assets
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
}
