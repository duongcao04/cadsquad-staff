import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Header, Sidebar } from '../shared/components'
import { AuthGuard } from '../shared/guards'

export const Route = createFileRoute('/_workspace')({
    component: WorkspaceLayout,
})

function WorkspaceLayout() {
    return (
        <AuthGuard>
            <div className="fixed top-0 w-full z-50">
                <Header />
            </div>
            {/* Height for header */}
            <div className="h-14" />
            <main className="relative h-[calc(100vh-56px)] flex items-start justify-start w-screen overflow-x-hidden">
                <div className="sticky top-0 h-full">
                    <Sidebar />
                </div>
                <div className="size-full overflow-y-auto overflow-x-hidden h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] bg-background-muted">
                    <Outlet />
                </div>
            </main>
        </AuthGuard>
    )
}
