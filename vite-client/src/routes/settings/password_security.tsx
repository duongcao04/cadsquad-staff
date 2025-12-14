import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/password_security')({
    component: PasswordAndSecurityPage,
})

function PasswordAndSecurityPage() {
    return <div></div>
}
