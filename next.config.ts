import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatar.iran.liara.run',
                pathname: '/public/boy',
            },
        ],
    },
    /* config options here */
    eslint: {
        // Tắt ESLint trong quá trình build
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Tắt TypeScript type checking trong quá trình build
        ignoreBuildErrors: true,
    },
}
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withNextIntl(nextConfig)
