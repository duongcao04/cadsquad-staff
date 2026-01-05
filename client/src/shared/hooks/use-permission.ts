import { useCallback, useMemo } from 'react'
import { useProfile } from '../../lib'
import { AppPermission } from '../../lib/utils'

export const usePermission = () => {
    const { profile: user, isLoading: loadingProfile } = useProfile()

    // Memoize danh sách string permissions
    const userPermissions = useMemo(() => {
        return user?.role?.permissions?.map((p) => p.entityAction) || []
    }, [user])

    // Sử dụng useCallback để tránh tạo function mới mỗi lần render
    const hasAnyPermission = useCallback(
        (requiredPerms: AppPermission | AppPermission[]) => {
            if (!user?.role) return false
            if (user.role.code === 'admin') return true

            const required = Array.isArray(requiredPerms)
                ? requiredPerms
                : [requiredPerms]
            if (required.length === 0) return true

            return required.some((code) => userPermissions.includes(code))
        },
        [user?.role, userPermissions]
    )

    const hasAllPermissions = useCallback(
        (requiredPerms: AppPermission | AppPermission[]) => {
            if (!user?.role) return false
            if (user.role.code === 'admin') return true

            const required = Array.isArray(requiredPerms)
                ? requiredPerms
                : [requiredPerms]
            if (required.length === 0) return true

            return required.every((code) => userPermissions.includes(code))
        },
        [user?.role, userPermissions]
    )

    return {
        user,
        userPermissions,
        loadingProfile,
        hasAnyPermission,
        hasAllPermissions,
        hasPermission: hasAnyPermission,
    }
}
