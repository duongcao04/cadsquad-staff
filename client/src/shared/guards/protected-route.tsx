import { addToast } from '@heroui/react'
import { useLocation, useRouter } from '@tanstack/react-router'
import { useEffect, useState, useMemo } from 'react'
import { cookie, COOKIES, INTERNAL_URLS } from '../../lib'
import { AppPermission } from '../../lib/utils/_app-permissions'
import { usePermission } from '../hooks'

interface ProtectedRouteProps {
    children: React.ReactNode
    permissions?: AppPermission | AppPermission[]
    requireAll?: boolean
}

export default function ProtectedRoute({
    children,
    permissions = [],
    requireAll = false,
}: ProtectedRouteProps) {
    const router = useRouter()
    const { pathname } = useLocation()
    const { user, hasAnyPermission, hasAllPermissions, loadingProfile } =
        usePermission()
    const [isChecking, setIsChecking] = useState(true)

    // Memoize mảng quyền dựa trên giá trị chuỗi thực tế của chúng
    const permsArray = useMemo(
        () => (Array.isArray(permissions) ? permissions : [permissions]),
        [JSON.stringify(permissions)] // So sánh giá trị thay vì tham chiếu mảng
    )

    useEffect(() => {
        const validate = async () => {
            const token = cookie.get(COOKIES.authentication)

            // 1. Kiểm tra Token vật lý
            if (!token) {
                router.navigate({
                    href: `${INTERNAL_URLS.login}?redirect=${encodeURIComponent(pathname)}`,
                })
                return
            }

            // 2. Chờ load Profile (Tránh redirect nhầm khi đang fetch)
            if (loadingProfile) return

            // 3. Kiểm tra User tồn tại
            if (!user) {
                addToast({ title: 'Phiên đăng nhập hết hạn', color: 'danger' })
                router.navigate({ href: INTERNAL_URLS.login })
                return
            }

            // 4. Kiểm tra Quyền thực tế
            const isAllowed =
                permsArray.length === 0
                    ? true
                    : requireAll
                      ? hasAllPermissions(permsArray)
                      : hasAnyPermission(permsArray)

            if (!isAllowed) {
                addToast({
                    title: 'Truy cập bị từ chối',
                    description: 'Bạn không có quyền truy cập vào trang này.',
                    color: 'danger',
                })
                router.navigate({ href: '/' })
                return
            }

            // Tắt trạng thái checking khi mọi điều kiện đã PASS
            setIsChecking(false)
        }

        validate()
    }, [
        user,
        loadingProfile,
        permsArray,
        requireAll,
        pathname,
        router,
        hasAnyPermission,
        hasAllPermissions,
    ])

    // Render loading screen nếu đang tải profile hoặc đang trong quá trình validate quyền
    if (loadingProfile || isChecking) return <LoadingScreen />

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
