import { createFileRoute } from '@tanstack/react-router'

import { LoginForm } from '../../shared/components'
import { getPageTitle } from '../../lib'

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
