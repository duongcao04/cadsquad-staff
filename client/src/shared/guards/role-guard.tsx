import { addToast } from '@heroui/react'
import { useLocation, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { authApi, cookie, COOKIES, INTERNAL_URLS } from '../../lib'
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
            const token = cookie.get(COOKIES.authentication)

            // 1. Nếu không có token ngay từ đầu -> Về Login
            if (!token) {
                setIsLoading(false)
                router.navigate({
                    href: INTERNAL_URLS.login + `?redirect=${pathname}`,
                })
                return
            }

            try {
                // 2. Fetch User Profile
                const user = await authApi
                    .getProfile()
                    .then((res) => res.data.result)

                if (!user) throw new Error('User profile not found')

                // 3. Check Role Permission
                const hasPermission =
                    allowedRoles.length === 0 ||
                    allowedRoles.includes(user.role)

                if (!hasPermission) {
                    addToast({
                        title: 'Truy cập bị từ chối',
                        description:
                            'Bạn không có quyền truy cập vào chức năng này.',
                        color: 'danger',
                    })
                    router.navigate({ href: '/' })
                    return
                }

                setIsAuthorized(true)
            } catch (error: any) {
                console.error('Guard validation failed:', error)

                // Lấy message từ server nếu có (ví dụ: "Your account has been deactivated")
                const serverMessage = error.response?.data?.message
                const status = error.response?.status

                // Xử lý thông báo
                if (status === 401 || status === 403) {
                    // Xóa cookie vì phiên làm việc không còn hợp lệ (hoặc bị khóa)
                    cookie.remove(COOKIES.authentication)

                    addToast({
                        title:
                            status === 403
                                ? 'Tài khoản bị khóa'
                                : 'Phiên đăng nhập hết hạn',
                        description:
                            serverMessage ||
                            'Vui lòng đăng nhập lại để tiếp tục.',
                        color: 'danger',
                    })
                } else {
                    addToast({
                        title: 'Lỗi hệ thống',
                        description:
                            serverMessage ||
                            'Không thể xác thực quyền truy cập.',
                        color: 'danger',
                    })
                }

                router.navigate({ href: INTERNAL_URLS.login })
            } finally {
                setIsLoading(false)
            }
        }

        validateAccess()
    }, [router, pathname, allowedRoles])

    if (isLoading) return <LoadingScreen />
    if (!isAuthorized) return null

    return <>{children}</>
}

function LoadingScreen() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />

                <p className="text-sm text-text-default">Verifying access...</p>
            </div>
        </div>
    )
}
