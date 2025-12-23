import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ManagerGuard } from '../shared/guards'
import { AdminSidebar } from '../shared/components/admin/layouts/AdminSidebar'
import { AdminHeader } from '../shared/components/admin/layouts/AdminHeader'
import { ScrollArea, ScrollBar } from '../shared/components'
import { DashboardRightPanel } from '../shared/components/admin/DashboardRightPanel'
import { useStore } from '@tanstack/react-store'
import { appStore, ESidebarStatus } from '../shared/stores'

// Lưu ý: path là id ảo, không xuất hiện trên URL
export const Route = createFileRoute('/_administrator')({
    component: AdminLayout,
})

function AdminLayout() {
    const adminLeftSidebar = useStore(
        appStore,
        (state) => state.adminLeftStatus
    )
    const adminRightSidebar = useStore(
        appStore,
        (state) => state.adminRightStatus
    )

    return (
        <ManagerGuard>
            <div id="admin-page">
                <div className="fixed top-0 w-full z-50">
                    <AdminHeader />
                </div>
                {/* Height for header */}
                <div className="h-14" />
                <div className="relative w-full h-full flex items-start justify-start">
                    <div className="fixed left-0 top-14.25 z-50 space-y-6 border-r border-border-default h-full bg-background">
                        <AdminSidebar
                            isCollapsed={
                                adminLeftSidebar === ESidebarStatus.COLLAPSE
                            }
                        />
                    </div>
                    <div
                        className="size-full"
                        style={{
                            marginLeft:
                                adminLeftSidebar === 'collapse'
                                    ? '80px'
                                    : '256px',
                            marginRight:
                                adminRightSidebar === 'collapse'
                                    ? '80px'
                                    : '320px',
                            transition:
                                'margin 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        <ScrollArea className="size-full h-[calc(100vh-57px)] bg-background-muted">
                            <ScrollBar orientation="horizontal" />
                            <ScrollBar orientation="vertical" />
                            <Outlet />
                        </ScrollArea>
                    </div>
                    <div className="fixed right-0 top-14.25 z-50 border-l border-border-default h-full space-y-6 bg-background">
                        <DashboardRightPanel
                            isCollapsed={
                                adminRightSidebar === ESidebarStatus.COLLAPSE
                            }
                        />
                    </div>
                </div>
            </div>
        </ManagerGuard>
    )
}
