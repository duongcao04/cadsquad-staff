import { getTranslations } from 'next-intl/server'

import Header from '@/shared/components/layouts/Header'
import Sidebar from '@/shared/components/layouts/Sidebar'

import AdminCreateButton from './_components/AdminCreateButton'
import HeadingTitle from './_components/HeadingTitle'
import Timmer from './_components/Timmer'

export async function generateMetadata({
    params,
}: Readonly<{
    params: Promise<{ locale: string }>
}>) {
    const { locale } = await params

    const tMetadata = await getTranslations({
        locale,
        namespace: 'metadata.aboutUs',
    })

    return {
        title: tMetadata('title'),
        desctiption: tMetadata('description'),
    }
}

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="dashboard-page">
            <Header />
            <main className="container py-3">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center justify-start gap-5">
                        <AdminCreateButton />
                        <div className="w-0.5 h-6 bg-border" />
                        <HeadingTitle />
                    </div>
                    <Timmer />
                </div>
                <div className="grid grid-cols-[70px_1fr] gap-2">
                    <Sidebar />
                    <div className="rounded-md size-full">{children}</div>
                </div>
            </main>
        </div>
    )
}
