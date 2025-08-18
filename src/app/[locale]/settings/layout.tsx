import { getTranslations } from 'next-intl/server'
import Header from '@/shared/components/layouts/Header'
import SettingSidebar from './_components/SettingSidebar'

export async function generateMetadata({
    params,
}: Readonly<{
    params: Promise<{ locale: string }>
}>) {
    const { locale } = await params

    const tMetadata = await getTranslations({
        locale,
        namespace: 'metadata.settings',
    })

    return {
        title: tMetadata('title'),
        desctiption: tMetadata('description'),
    }
}

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="dashboard-page">
            <div className="fixed top-0 w-full z-[99]">
                <Header />
            </div>
            {/* Height for header */}
            <div className="h-[56px]" />
            {/*  */}
            <main className="max-w-screen h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] overflow-y-auto overflow-x-hidden">
                <div className="mx-auto mt-14 max-w-[1540px] lg:px-14">
                    <div className="w-full grid grid-cols-[360px_1fr] gap-12">
                        <SettingSidebar />
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
