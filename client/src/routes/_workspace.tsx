import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { Header, ScrollArea, ScrollBar, Sidebar } from '../shared/components'
import AppLoading from '../shared/components/app/AppLoading'
import MobileHeader from '../shared/components/layouts/Header/MobileHeader'
import { AuthGuard } from '../shared/guards'
import { useDevice } from '../shared/hooks'
import { appStore } from '../shared/stores'

export const Route = createFileRoute('/_workspace')({
    pendingComponent: AppLoading,
    component: WorkspaceLayout,
})

function WorkspaceLayout() {
    const sidebarStatus = useStore(appStore, (state) => state.sidebarStatus)
    const { isLargeDevice } = useDevice()

    return (
        <AuthGuard>
            {isLargeDevice ? <Header /> : <MobileHeader />}
            {/* Height for header */}
            <div className={isLargeDevice ? 'h-14' : 'h-11'} />
            <main className="size-full relative flex items-start justify-start">
                {isLargeDevice ? (
                    <div className="fixed top-14">
                        <Sidebar />
                    </div>
                ) : null}
                <div
                    className="size-full bg-background-muted"
                    style={{
                        paddingLeft: isLargeDevice
                            ? sidebarStatus === 'expand'
                                ? '300px'
                                : '64px'
                            : undefined,
                    }}
                >
                    <ScrollArea
                        className="size-full bg-background-muted"
                        style={{
                            height: isLargeDevice
                                ? 'calc(100vh-57px)'
                                : 'calc(100vh-44px)',
                        }}
                    >
                        <ScrollBar orientation="horizontal" />
                        <ScrollBar orientation="vertical" />
                        <Outlet />
                    </ScrollArea>
                </div>
            </main>
        </AuthGuard>
    )
}
