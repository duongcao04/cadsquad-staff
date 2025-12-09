'use client'

import { CadsquadLogo } from '@/shared/components'
import { LoginForm } from '@/shared/components/forms/LoginForm'
import { useTheme } from 'next-themes'

export default function AuthPage() {
    const { resolvedTheme } = useTheme()
    return (
        <div
            className="w-screen h-screen overflow-hidden flex items-center justify-center flex-col gap-8"
            style={{
                backgroundImage:
                    resolvedTheme === 'light'
                        ? 'linear-gradient(60deg, #f3f3c3, #D4D3DD)'
                        : 'linear-gradient(60deg, #0f0c29, #302b63 50%, #24243e)',
            }}
            suppressHydrationWarning
        >
            <CadsquadLogo
                classNames={{
                    logo: 'w-32 lg:w-64',
                }}
                logoTheme="default"
            />
            <LoginForm />
        </div>
    )
}
