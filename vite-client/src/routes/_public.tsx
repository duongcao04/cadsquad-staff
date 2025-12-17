import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Header } from '../shared/components'

export const Route = createFileRoute('/_public')({
    component: PublicLayout,
})

function PublicLayout() {
    return (
        <div>
            <div className="fixed top-0 w-full z-10">
                <Header />
            </div>
            {/* Height for header */}
            <div className="h-14" />
            <main className="size-full">
                <Outlet />
            </main>
        </div>
    )
}
