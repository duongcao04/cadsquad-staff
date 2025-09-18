import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
    params,
}: Readonly<{
    params: Promise<{ locale: string }>
}>) {
    const { locale } = await params

    const tMetadata = await getTranslations({
        locale,
        namespace: 'metadata.team',
    })

    return {
        title: tMetadata('title'),
        desctiption: tMetadata('description'),
    }
}

export default async function TeamLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return children
}
