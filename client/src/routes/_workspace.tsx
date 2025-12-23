import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Header, ScrollArea, ScrollBar, Sidebar } from '../shared/components'
import { AuthGuard } from '../shared/guards'
import { useStore } from '@tanstack/react-store'
import { appStore } from '../shared/stores'
import AppLoading from '../shared/components/app/AppLoading'

export const Route = createFileRoute('/_workspace')({
    pendingComponent: AppLoading,
    component: WorkspaceLayout,
})

function WorkspaceLayout() {
    const sidebarStatus = useStore(appStore, (state) => state.sidebarStatus)

    return (
        <AuthGuard>
            <Header />
            {/* Height for header */}
            <div className="h-14" />
            <main className="size-full relative flex items-start justify-start">
                <div className="fixed top-14">
                    <Sidebar />
                </div>
                <div
                    className="size-full bg-background-muted"
                    style={{
                        paddingLeft:
                            sidebarStatus === 'expand' ? '300px' : '64px',
                    }}
                >
                    <ScrollArea className="size-full h-[calc(100vh-57px)] bg-background-muted">
                        <ScrollBar orientation="horizontal" />
                        <ScrollBar orientation="vertical" />
                        <Outlet />
                    </ScrollArea>
                </div>
            </main>
        </AuthGuard>
    )
}
