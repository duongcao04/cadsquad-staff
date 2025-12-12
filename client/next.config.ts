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

    experimental: {
        // Keep only packages that benefit:
        optimizePackageImports: ['lucide-react', 'date-fns', 'lodash'],
    },

    logging: {
        fetches: {
            fullUrl: true,
        },
    },

    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        })
        return config
    },

    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
export default withNextIntl(nextConfig)
