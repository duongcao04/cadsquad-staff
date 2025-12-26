import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '../shared/guards'
import { CommunitiesHeader } from '../shared/components/communities/layouts/CommunitiesHeader'
import { useStore } from '@tanstack/react-store'
import { appStore } from '../shared/stores'
import { ScrollArea, ScrollBar } from '../shared/components'
import CommunitiesSidebar from '../shared/components/communities/layouts/CommunitiesSidebar'

export const Route = createFileRoute('/communities')({
    component: CommunitiesLayout,
})

function CommunitiesLayout() {
    const communitiesLeftStatus = useStore(
        appStore,
        (state) => state.communitiesLeftStatus
    )

    return (
        <AuthGuard>
            <div id="communities-page">
                <div className="fixed top-0 w-full z-50">
                    <CommunitiesHeader />
                </div>
                {/* Height for header */}
                <div className="h-14" />
                <div className="relative w-full h-full flex items-start justify-start">
                    <div className="fixed left-0 top-14.25 z-50 space-y-6 border-r border-border-default h-full bg-background">
                        <CommunitiesSidebar
                        // isCollapsed={
                        //     adminLeftSidebar === ESidebarStatus.COLLAPSE
                        // }
                        />
                    </div>
                    <div
                        className="size-full"
                        style={{
                            marginLeft:
                                communitiesLeftStatus === 'collapse'
                                    ? '72px'
                                    : '288px',
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
                    {/* <div className="fixed right-0 top-14.25 z-50 border-l border-border-default h-full space-y-6 bg-background">
                        <DashboardRightPanel
                            isCollapsed={
                                adminRightSidebar === ESidebarStatus.COLLAPSE
                            }
                        />
                    </div> */}
                </div>
            </div>
        </AuthGuard>
    )
}
