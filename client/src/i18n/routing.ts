import { defineRouting } from 'next-intl/routing'

export type SupportLanguages = 'en' | 'vi'

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'vi'] as const,

    // Used when no locale matches
    defaultLocale: 'vi',

    // Optional: Define path patterns for locale detection
    localePrefix: 'always', // Always show locale in URL

    // Optional: Define alternate domains for locales (if needed)
    // domains: [
    //     {
    //         domain: 'example.com',
    //         defaultLocale: 'en'
    //     },
    //     {
    //         domain: 'example.vn',
    //         defaultLocale: 'vi'
    //     }
    // ]
})