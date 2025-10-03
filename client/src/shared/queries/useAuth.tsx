'use client'

import { cookie } from '@/lib/cookie'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/app/api/auth.api'
import { LoginInput } from '@/shared/validationSchemas/auth.schema'
import { RoleEnum } from '@/shared/enums/role.enum'
import { queryClient } from '@/app/providers/TanstackQueryProvider'

export default function useAuth() {
    const {
        data: profile,
        isLoading: loadingProfile,
        isFetching: fetchingProfile,
    } = useQuery({
        queryKey: ['profile'],
        queryFn: () => authApi.getProfile(),
        select: (res) => res.data.result,
    })

    const userRole = profile?.role as RoleEnum

    const login = async (loginInput: LoginInput) => {
        return await authApi.login(loginInput).then(async (res) => {
            console.log(res)
            const {
                accessToken: { token, expiresAt },
            } = res.data.result
            // Set cookie for authentication
            cookie.set('session', token, {
                path: '/',
                expires: new Date(expiresAt),
            })
        })
    }

    const logout = async () => {
        try {
            cookie.remove('session')
        } catch (error) {
            console.log(error)
        } finally {
            queryClient.removeQueries()
        }
    }

    return {
        profile,
        loadingProfile: loadingProfile || fetchingProfile,
        userRole,
        login,
        logout,
    }
}
