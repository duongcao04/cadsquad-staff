import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
    params,
}: Readonly<{
    params: Promise<{ locale: string }>
}>) {
    const { locale } = await params

    const tMetadata = await getTranslations({
        locale,
        namespace: 'metadata.projectCenter',
    })

    return {
        title: tMetadata('title'),
        desctiption: tMetadata('description'),
    }
}

export default async function ProjectCenterLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return children
}
