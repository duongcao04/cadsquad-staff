import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/')({
    component: SettingsIndexPage,
})
function SettingsIndexPage() {
    return (
        <div>
            <h1>General Settings</h1>
            <p>Thông tin chung...</p>
        </div>
    )
}
