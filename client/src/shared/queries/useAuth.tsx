'use client'

import { cookie } from '@/lib/cookie'
import { useMutation, useQuery } from '@tanstack/react-query'
import { authApi } from '@/app/api/auth.api'
import { LoginInput } from '@/shared/validationSchemas/auth.schema'
import { RoleEnum } from '@/shared/enums/role.enum'
import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { ApiError } from '@/lib/axios'

export const useLogin = () => {
    return useMutation({
        mutationFn: (data: LoginInput) => authApi.login(data),
        onSuccess: (res) => {
            const {
                accessToken: { token, expiresAt },
            } = res.data.result
            // Set cookie for authentication
            cookie.set('session', token, {
                path: '/',
                expires: new Date(expiresAt),
            })
        },
        onError: (error: ApiError) => {
            console.log(error)
        },
    })
}

export const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            return cookie.remove('session')
        },
        onSuccess: () => {
            queryClient.removeQueries()
        },
    })
}

export function useProfile() {
    const {
        data: profile,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ['profile'],
        queryFn: () => authApi.getProfile(),
        select: (res) => res.data.result,
    })

    const userRole = profile?.role as RoleEnum

    const isAdmin = userRole === RoleEnum.ADMIN
    const isStaff = userRole === RoleEnum.ADMIN
    const isAccounting = userRole === RoleEnum.ADMIN

    return {
        profile,
        isLoading: isLoading || isFetching,
        isStaff,
        isAdmin,
        isAccounting,
        userRole,
    }
}

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
        logout,
    }
}
