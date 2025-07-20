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
        namespace: 'metadata.dashboard',
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
            <div className="fixed top-0 w-full z-[99]">
                <Header />
            </div>
            <div className="h-[60px]" />
            <main className="py-3">
                <div className="container flex items-center justify-between mb-4">
                    <div className="flex items-center justify-start gap-5">
                        <AdminCreateButton />
                        <div className="w-0.5 h-6 bg-border" />
                        <HeadingTitle />
                    </div>
                    <Timmer />
                </div>
                <div className="max-w-screen pl-3 grid grid-cols-[70px_1fr] gap-2">
                    <Sidebar />
                    <div className="h-[calc(100vh-60px-24px-40px-16px)] rounded-md size-full overflow-y-auto overflow-x-hidden pr-3">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
