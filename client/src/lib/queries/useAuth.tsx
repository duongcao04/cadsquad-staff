'use client'

import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { authApi } from '@/lib/api'
import { ApiError } from '@/lib/axios'
import { cookie } from '@/lib/cookie'
import { IMAGES } from '@/lib/utils'
import { LoginInput } from '@/lib/validationSchemas'
import { RoleEnum } from '@/shared/enums'
import { TUser } from '@/shared/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import lodash from 'lodash'
import { useMemo } from 'react'

function parseExpires(expiresAt: string | number) {
    if (typeof expiresAt === 'number') {
        const ms =
            String(expiresAt).length === 10 ? expiresAt * 1000 : expiresAt
        return new Date(ms)
    }
    return new Date(expiresAt)
}

export const useLogin = () => {
    const mutation = useMutation({
        mutationFn: (data: LoginInput) => authApi.login(data),
        onSuccess: (res) => {
            const {
                accessToken: { token, expiresAt },
            } = res.data.result
            // Set cookie for authentication
            cookie.set('authentication', token, {
                path: '/',
                expires: parseExpires(expiresAt),
            })
        },
        onError: (error: ApiError) => {
            console.log(error)
        },
    })
    return {
        ...mutation,
        accessToken: mutation.data?.data.result.accessToken.token,
    }
}
export const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            cookie.remove('authentication')

            queryClient.clear?.()
            queryClient.invalidateQueries?.()
            queryClient.removeQueries?.()
        },
    })
}

export function useProfile() {
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['profile'],
        queryFn: () => authApi.getProfile(),
        select: (res) => res.data.result,
    })

    const accessToken = cookie.get('authentication')

    const profile = useMemo(() => {
        const profileData = data

        if (lodash.isEmpty(profileData)) {
            return {} as TUser
        }

        return {
            id: data?.id,
            configs: data?.configs,
            displayName: data?.displayName ?? '',
            email: data?.email ?? '',
            files: data?.files ?? [],
            accounts: data?.accounts ?? [],
            createdAt: data?.createdAt ? new Date(data?.createdAt) : null,
            updatedAt: data?.updatedAt ? new Date(data?.updatedAt) : null,
            role: data?.role ?? RoleEnum.USER,
            filesCreated: data?.filesCreated ?? [],
            isActive: data?.isActive ?? false,
            jobActivityLog: data?.jobActivityLog ?? [],
            jobsAssigned: data?.jobsAssigned ?? [],
            jobsCreated: data?.jobsCreated ?? [],
            notifications: data?.notifications ?? [],
            sendedNotifications: data?.sendedNotifications ?? [],
            username: data?.username ?? '',
            avatar: data?.avatar ?? IMAGES.emptyAvatar,
            department: data?.department ?? null,
            jobTitle: data?.jobTitle ?? null,
            lastLoginAt: data?.lastLoginAt
                ? new Date(data?.lastLoginAt)
                : new Date(),
            phoneNumber: data?.phoneNumber ?? '',
        } as TUser
    }, [data])

    const userRole = profile?.role

    const isAdmin = userRole === RoleEnum.ADMIN
    const isStaff = userRole === RoleEnum.USER
    const isAccounting = userRole === RoleEnum.ACCOUNTING

    return {
        profile,
        isLoading: isLoading || isFetching,
        isStaff,
        isAdmin,
        isAccounting,
        accessToken,
        userRole,
    }
}

export function useAuth() {
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

    return {
        profile,
        loadingProfile: loadingProfile || fetchingProfile,
        userRole,
    }
}
