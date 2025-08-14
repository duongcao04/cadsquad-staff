import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

import { publicRoutes } from '@/config/routeConfig'

import apiMiddleware from './app/api/utils/api-middleware'
import { removeLocaleFromPathname, routing } from './i18n/routing'
import { verifyToken } from './lib/auth/session'

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing)

function isPublicRoute(pathname: string): boolean {
    // 1. Remove locale prefix to check the actual route
    const pathWithoutLocale = removeLocaleFromPathname(pathname)
    return publicRoutes.some(
        (route) =>
            pathWithoutLocale === route || pathWithoutLocale.startsWith(route)
    )
}

export default async function middleware(request: NextRequest) {
    // Get current pathname
    const { pathname } = request.nextUrl

    // Skip locale handling for API routes
    if (pathname.startsWith('/api')) {
        return await apiMiddleware(request)
    }

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
        }
        const isCertificated = await verifyToken(sessionCookie)
        if (!isCertificated) {
            return redirectToAuth()
        }
    }

    // If already logged in and trying to access auth pages → redirect to dashboard
    if (sessionCookie && pathname.includes('/auth')) {
        const dashboardUrl = new URL(`/${finalLocale}/`, request.url)
        return NextResponse.redirect(dashboardUrl)
    }

    // Fallback → apply i18n middleware
    return intlMiddleware(request)
}

export const config = {
    matcher: [
        // Match EVERYTHING except _next static files and assets
        '/((?!_next|_vercel|.*\\..*).*)',
    ],
}
