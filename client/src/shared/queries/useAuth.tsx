'use client'

import { cookie } from '@/lib/cookie'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/app/api/auth.api'
import { LoginInput } from '@/shared/validationSchemas/auth.schema'
import { RoleEnum } from '@/shared/enums/role.enum'

export default function useAuth() {
    const profile = useQuery({
        queryKey: ['profile'],
        queryFn: () => authApi.getProfile(),
        select: (res) => res.data.result,
    })

    const userRole = profile.data?.role as RoleEnum

    const login = async (loginInput: LoginInput) => {
        return await authApi.login(loginInput)
            .then(async (res) => {
                console.log(res);
                const { accessToken: { token, expiresAt } } = res.data.result
                // Set cookie for authentication
                cookie.set('session', token, {
                    path: '/',
                    expires: new Date(expiresAt),
                })
            })
    }

    const logout = async () => {
        return cookie.remove('session')
    }

    return { profile, userRole, login, logout }
}
