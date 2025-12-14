import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '../shared/guards'

// Lưu ý: path là id ảo, không xuất hiện trên URL
export const Route = createFileRoute('/settings')({
    component: SettingsLayout,
})

function SettingsLayout() {
    return (
        <AuthGuard>
            <Outlet />
        </AuthGuard>
    )
}
