import React from 'react'
import { AppPermission } from '../../lib/utils'
import { usePermission } from '../hooks'

interface PermissionGuardProps {
    permission: AppPermission
    children: React.ReactNode
    fallback?: React.ReactNode
}
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    permission,
    children,
    fallback = null,
}) => {
    const { hasPermission } = usePermission()
    const isAllowed = hasPermission(permission)

    if (!isAllowed) return <>{fallback}</>
    return <>{children}</>
}
