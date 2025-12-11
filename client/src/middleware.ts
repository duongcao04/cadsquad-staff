import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createIntlMiddleware(routing)

export const config = {
    matcher: [
        // Enable a redirect to a matching locale at the root
        '/',

        // Set a cookie to remember the previous locale for
        // all requests that contain a locale prefix
        '/(en|vi)/:path*', // Add your specific locales here or use generic regex

        // Enable redirects that add missing locales
        // (e.g. `/pathnames` -> `/en/pathnames`)
        '/((?!_next|_vercel|.*\\..*).*)',
    ],
}
