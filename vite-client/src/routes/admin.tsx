import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AdminGuard } from '../shared/guards'

// Lưu ý: path là id ảo, không xuất hiện trên URL
export const Route = createFileRoute('/admin')({
    component: AdminLayout,
})

function AdminLayout() {
    return (
        <AdminGuard>
            <Outlet />
        </AdminGuard>
    )
}
