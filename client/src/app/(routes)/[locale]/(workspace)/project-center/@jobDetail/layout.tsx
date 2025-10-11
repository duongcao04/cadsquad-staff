import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
    params: Promise<{ locale: string }>
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // Get locale and check if it's valid
    const { locale } = await params

    // Use server-side translations
    const tMetadata = await getTranslations({
        locale,
        namespace: 'metadata.workbench',
    })

    return {
        title: tMetadata('title'),
        description: tMetadata('description'),
        keywords: tMetadata('keywords').split(','),
        openGraph: {
            title: tMetadata('ogTitle'),
            description: tMetadata('ogDescription'),
            images: [
                {
                    url: tMetadata('ogImage'),
                    width: 1200,
                    height: 630,
                    alt: tMetadata('ogTitle'),
                },
            ],
            siteName: 'staff.cadsquad.vn',
            locale: 'en_US',
            type: 'website',
        },
        alternates: {
            canonical: tMetadata('canonical'),
        },
    }
}

export default function ProjectCenterJobDetailLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
