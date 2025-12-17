import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '../shared/guards'
import { Header } from '../shared/components'
import { SettingsSidebar } from '../shared/components/settings/layouts/SettingsSidebar'

// Lưu ý: path là id ảo, không xuất hiện trên URL
export const Route = createFileRoute('/settings')({
    component: SettingsLayout,
})

function SettingsLayout() {
    return (
        <AuthGuard>
            <div className="fixed top-0 w-full z-10">
                <Header />
            </div>
            {/* Height for header */}
            <div className="h-14" />
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
                {/* Sticky Sidebar */}
                <SettingsSidebar selectedKey="profile" />

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    <Outlet />
                </main>
            </div>
        </AuthGuard>
    )
}
