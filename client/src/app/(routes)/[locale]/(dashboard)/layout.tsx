import Header from '@/shared/components/layouts/Header'
import Sidebar from '@/shared/components/layouts/Sidebar'

import ActionButton from './_components/ActionButton'

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
            <main className="max-w-screen">
                <div className="size-full flex items-start justify-start gap-2">
                    <div className="space-y-5 py-2.5">
                        <div className="mt-2 pl-4">
                            <ActionButton />
                        </div>
                        <Sidebar />
                    </div>
                    <div className="size-full h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] pr-3.5 overflow-y-auto overflow-x-hidden">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
