import Header from '@/shared/components/layouts/Header'

export default async function SettingsLayout({
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
            <main className="size-full h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] overflow-y-auto overflow-x-hidden">
                {children}
            </main>
        </div>
    )
}
