import { addToast } from '@heroui/react'
import { useLocation, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { authApi } from '@/lib/api'

import { cookie } from '../../lib/cookie'
import { COOKIES, INTERNAL_URLS } from '../../lib/utils'
import { RoleEnum } from '../enums'

interface RoleGuardProps {
    children: React.ReactNode
    /**
     * List of roles allowed to access this route.
     * If empty or undefined, it acts as a basic AuthGuard (just checks login).
     */
    allowedRoles?: RoleEnum[]
}

export default function RoleGuard({
    children,
    allowedRoles = [],
}: RoleGuardProps) {
    const router = useRouter()
    const pathname = useLocation().pathname
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const validateAccess = async () => {
            try {
                // 1. Check Token
                const token = cookie.get(COOKIES.authentication)

                if (!token) {
                    // Redirect to login, remembering where they wanted to go
                    router.navigate({
                        href: INTERNAL_URLS.login + `?redirect=${pathname}`,
                    })
                    return
                }

                // 2. Fetch User Profile
                // Assuming response structure: { data: { result: { role: 'ADMIN', ... } } }
                const user = await authApi
                    .getProfile()
                    .then((res) => res.data.result)

                if (!user) {
                    throw new Error('User profile not found')
                }

                // 3. Check Role Permission
                // If allowedRoles is empty, we only care that the user exists (Basic Auth)
                // If allowedRoles has values, the user's role MUST be in that list
                const hasPermission =
                    allowedRoles.length === 0 ||
                    allowedRoles.includes(user.role)

                if (!hasPermission) {
                    // User is logged in, but doesn't have the right role.
                    // Redirect to a safe page (Home or a 403 page)
                    router.navigate({ href: '/' })
                    return
                }

                // 4. Access Granted
                setIsAuthorized(true)
            } catch (error) {
                console.error('Guard validation failed:', error)
                addToast({
                    title: 'Phiên đăng nhập đã hết hạn',
                    description: 'Vui lòng đăng nhập lại để tiếp tục sử dụng.',
                    color: 'primary',
                })
                // On error (token expired, api down), force re-login
                router.navigate({ href: INTERNAL_URLS.login })
            } finally {
                setIsLoading(false)
            }
        }

        validateAccess()
    }, [router, pathname, allowedRoles])

    if (isLoading) {
        return <LoadingScreen />
    }

    if (!isAuthorized) {
        return null
    }

    return <>{children}</>
}

// Simple internal loading component
function LoadingScreen() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-gray-500">Verifying access...</p>
            </div>
        </div>
    )
}
