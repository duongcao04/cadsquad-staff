'use client'

import { useRouter } from '@/i18n/navigation'
import { cookie } from '@/lib/cookie'
import { CadsquadLogo } from '@/shared/components'
import { useSearchParam } from '@/shared/hooks'
import { LoginForm } from './shared'

export default function AuthPage() {
    const router = useRouter()
    const { getSearchParam } = useSearchParam()

    const isAuthenticated = cookie.get('authentication')
    if (isAuthenticated) {
        const redirect = getSearchParam('redirect')
        if (redirect) {
            return router.push(redirect)
        }
        return router.push('/')
    }

    return (
        <div className="w-screen h-screen overflow-hidden flex items-center justify-center flex-col gap-8 bg-gradient-to-r from-[#f3f3c3] to-[#D4D3DD]">
            <CadsquadLogo
                classNames={{
                    logo: 'w-64',
                }}
                logoTheme="default"
            />
            <LoginForm />
        </div>
    )
}
