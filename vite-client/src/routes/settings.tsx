import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '../shared/guards'
import { Header } from '../shared/components'
import SettingsSidebar from '../shared/components/settings/layouts/SettingsSidebar'

// Lưu ý: path là id ảo, không xuất hiện trên URL
export const Route = createFileRoute('/settings')({
    component: SettingsLayout,
})

function SettingsLayout() {
    return (
        <AuthGuard>
            <div className="fixed top-0 w-full z-50">
                <Header />
            </div>
            {/* Height for header */}
            <div className="h-14 bg-background" />

            <div className="bg-background-muted">
                <div className="py-6 max-w-7xl mx-auto">
                    <div className="fixed top-20 px-3">
                        <h2 className="text-2xl font-bold text-text-default">
                            Settings
                        </h2>
                        <p className="text-sm text-text-subdued">
                            Manage your account preferences
                        </p>
                    </div>
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
                        {/* Sticky Sidebar */}
                        <div className="fixed top-38 w-70">
                            <SettingsSidebar />
                        </div>
                        <div />

                        {/* Main Content Area */}
                        <main className="py-6 px-1 flex-1 min-w-0">
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}
