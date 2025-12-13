import { createFileRoute } from '@tanstack/react-router'

import { LoginForm } from '../../shared/components'

export const Route = createFileRoute('/_auth/login')({
    component: LoginPage,
})

function LoginPage() {
    return <LoginForm />
}
