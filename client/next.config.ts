import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/project-center',
                destination: '/project-center/priority',
                permanent: true,
            },
        ]
    },

    images: {
        unoptimized: process.env.NODE_ENV === 'development',
        remotePatterns: [
            // Replace with your real hosts
            { protocol: 'https', hostname: 'cdn.yourapp.com' },
            { protocol: 'https', hostname: 'images.example.com' },
        ],
    },

    logging: {
        fetches: {
            fullUrl: true,
        },
    },

    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
export default withNextIntl(nextConfig)
