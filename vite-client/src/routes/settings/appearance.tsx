import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/appearance')({
    component: AppearancePage,
})

function AppearancePage() {
    return <div></div>
}
