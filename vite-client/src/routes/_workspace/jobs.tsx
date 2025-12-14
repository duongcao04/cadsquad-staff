import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '../../shared/guards'

export const Route = createFileRoute('/_workspace/jobs')({
    component: JobDetailLayout,
})

function JobDetailLayout() {
    return (
        <AuthGuard>
            <Outlet />
        </AuthGuard>
    )
}
