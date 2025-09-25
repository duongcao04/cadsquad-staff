import { getTranslations } from 'next-intl/server'
import React from 'react'

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
    jobDetail,
    addMember,
}: {
    children: React.ReactNode
    jobDetail: React.ReactNode
    addMember: React.ReactNode
}) {
    return (
        <div>
            {children}
            {jobDetail}
            {addMember}
        </div>
    )
}
