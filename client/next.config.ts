import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
    images: {
        unoptimized: process.env.NODE_ENV === 'development',
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Cho phép tất cả hostname
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: process.env.NODE_ENV === 'development',
    },
    typescript: {
        ignoreBuildErrors: process.env.NODE_ENV === 'development',
    },
}
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withNextIntl(nextConfig)
