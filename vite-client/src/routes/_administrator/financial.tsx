import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ManagerGuard } from '../../shared/guards'

export const Route = createFileRoute('/_administrator/financial')({
    component: FinancialLayout,
})

function FinancialLayout() {
    return (
        <ManagerGuard>
            <Outlet />
        </ManagerGuard>
    )
}
