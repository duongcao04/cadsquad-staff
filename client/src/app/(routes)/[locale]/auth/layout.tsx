import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
    params,
}: Readonly<{
    params: Promise<{ locale: string }>
}>) {
    const { locale } = await params

    const t = await getTranslations({
        locale,
        namespace: 'metadata.auth',
    })

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(','),
        openGraph: {
            title: t('ogTitle'),
            description: t('ogDescription'),
            images: [
                {
                    url: t('ogImage'),
                    width: 1200,
                    height: 630,
                    alt: t('ogTitle'),
                },
            ],
            siteName: 'staff.cadsquad.vn',
            locale: 'en_US',
            type: 'website',
        },
        alternates: {
            canonical: t('canonical'),
        },
    }
}

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
