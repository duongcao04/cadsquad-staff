import { Header, Sidebar } from '@/shared/components'
import { ActionButton } from './shared/components'

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div
            id="dashboard-page"
            className="max-w-screen max-h-screen overflow-auto bg-background"
        >
            <div className="fixed top-0 w-full z-[99]">
                <Header />
            </div>
            {/* Height for header */}
            <div className="h-[56px]" />
            <main className="size-full flex items-start justify-start h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] overflow-auto">
                <div className="h-full">
                    <div className="my-4 pl-4">
                        <ActionButton />
                    </div>
                    <div className="min-h-[calc(100vh-56px-120px)] h-[calc(100vh-56px-120px)]">
                        <Sidebar />
                    </div>
                </div>
                <div className="w-[1px] h-full bg-text-disabled" />
                <div className="size-full pl-7 pr-3.5 overflow-y-auto overflow-x-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
