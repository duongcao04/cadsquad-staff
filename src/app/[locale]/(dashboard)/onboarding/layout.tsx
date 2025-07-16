import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
    params,
}: Readonly<{
    params: Promise<{ locale: string }>
}>) {
    const { locale } = await params

    const tMetadata = await getTranslations({
        locale,
        namespace: 'metadata.onboarding',
    })

    return {
        title: tMetadata('title'),
        desctiption: tMetadata('description'),
    }
}

export default function layout({
    children,
    detail,
}: {
    children: React.ReactNode
    detail: React.ReactNode
}) {
    return (
        <div>
            {children}
            {detail}
        </div>
    )
}
