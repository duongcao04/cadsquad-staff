import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AdminGuard } from '../shared/guards'
import { AdminSidebar } from '../shared/components/admin/layouts/AdminSidebar'
import { AdminHeader } from '../shared/components/admin/layouts/AdminHeader'
import { ScrollArea, ScrollBar } from '../shared/components'
import { DashboardRightPanel } from '../shared/components/admin/DashboardRightPanel'

// Lưu ý: path là id ảo, không xuất hiện trên URL
export const Route = createFileRoute('/_administrator')({
    component: AdminLayout,
})

function AdminLayout() {
    return (
        <AdminGuard>
            <div id="admin-page">
                <div className="fixed top-0 w-full z-50">
                    <AdminHeader />
                </div>
                {/* Height for header */}
                <div className="h-14" />
                <div className="relative w-full h-full flex items-start justify-start">
                    <div className="fixed left-0 top-14.25 z-50 space-y-6 border-r border-text-disabled h-full bg-[#fafafa]! dark:bg-[#171717]!">
                        <AdminSidebar />
                    </div>
                    <div className="ml-64 mr-80 size-full">
                        <ScrollArea className="h-[calc(100vh-57px)]">
                            <ScrollBar orientation="horizontal" />
                            <ScrollBar orientation="vertical" />
                            <Outlet />
                        </ScrollArea>
                    </div>
                    <div className="fixed right-0 top-14.25 z-50 space-y-6 border-l border-text-disabled h-screen">
                        <DashboardRightPanel />
                    </div>
                </div>
            </div>
        </AdminGuard>
    )
}
