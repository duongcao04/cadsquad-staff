import Header from '@/shared/components/layouts/Header'
import Sidebar from '@/shared/components/layouts/Sidebar'

import ActionButton from './shared/components/ActionButton'

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div
            id="dashboard-page"
            className="max-w-screen max-h-screen overflow-hidden"
        >
            <div className="fixed top-0 w-full z-[99]">
                <Header />
            </div>
            {/* Height for header */}
            <div className="h-[56px]" />
            <main className="size-full flex items-start justify-start gap-2 h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] ">
                <div className="h-full">
                    <div className="my-4 pl-4">
                        <ActionButton />
                    </div>
                    <div className="min-h-[calc(100vh-56px-120px)] h-[calc(100vh-56px-120px)]">
                        <Sidebar />
                    </div>
                </div>
                <div className="size-full pr-3.5 overflow-y-auto overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    )
}
