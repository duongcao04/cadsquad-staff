import { createFileRoute, Outlet } from '@tanstack/react-router'

import { AdministratorGuard } from '../../shared/guards'

export const Route = createFileRoute('/_administrator/admin')({
    component: AdminLayout,
})

function AdminLayout() {
    return (
        <AdministratorGuard>
            <Outlet />
        </AdministratorGuard>
    )
}
