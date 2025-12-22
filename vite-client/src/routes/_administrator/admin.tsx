import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AdminGuard } from '../../shared/guards'

export const Route = createFileRoute('/_administrator/admin')({
    component: AdminLayout,
})

function AdminLayout() {
    return (
        <AdminGuard>
            <Outlet />
        </AdminGuard>
    )
}
