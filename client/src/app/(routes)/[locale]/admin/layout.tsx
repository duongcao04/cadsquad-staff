import AdminSettingsHeader from '@/shared/components/layouts/settings-header/AdminSettingsHeader'
import { AdminSettingSidebar } from '@/shared/components/layouts/settings-sidebar/AdminSettingsSidebar'
import { AdminGuard } from '../../../../shared/guards'

export default async function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AdminGuard>
            <div id="settings-page" className="h-screen w-screen">
                <div className="sticky top-0 w-full z-99 h-14">
                    <AdminSettingsHeader />
                </div>
                <main className="size-full h-[calc(100vh-56px)] max-h-[calc(100vh-56px)]">
                    <div className="size-full grid grid-cols-[300px_1fr] gap-5 overflow-x-hidden">
                        <div className="sticky top-20 left-0 size-full overflow-hidden pt-4">
                            <AdminSettingSidebar />
                        </div>
                        <div className="size-full overflow-y-auto pr-3">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </AdminGuard>
    )
}
