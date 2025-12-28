import { createFileRoute } from '@tanstack/react-router'

import { getPageTitle } from '../../lib'
import { LoginForm } from '../../shared/components'

export const Route = createFileRoute('/_auth/login')({
    head: () => ({
        meta: [
            {
                title: getPageTitle('Login'),
            },
            {
                name: 'description',
                content:
                    'Sign in to your account to manage your projects and tasks.',
            },
        ],
    }),
    component: LoginPage,
})

function LoginPage() {
    return <LoginForm />
}
