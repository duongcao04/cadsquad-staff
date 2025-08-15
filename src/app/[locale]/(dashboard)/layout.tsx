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
        namespace: 'metadata.workbench',
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
            {/* Height for header */}
            <div className="h-[56px]" />
            {/*  */}
            <main className="max-w-screen">
                <div className="size-full py-2.5 flex items-start justify-start gap-2">
                    <div className="space-y-5">
                        <div className="pl-4">
                            <AdminCreateButton />
                        </div>
                        <Sidebar />
                    </div>
                    <div className="rounded-md size-full h-[calc(100vh-56px-20px)] max-h-[calc(100vh-56px-20px)]  overflow-hidden">
                        <div className="flex items-center justify-between pr-3">
                            <HeadingTitle />
                            <Timmer />
                        </div>
                        <div className="h-[calc(100vh-56px-20px-20px-36px)] max-h-[calc(100vh-56px-20px-20px-36px)] mt-4 mb-2.5 pr-2.5 overflow-y-auto overflow-x-hidden">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
