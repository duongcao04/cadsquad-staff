import { useMutation, useQuery } from '@tanstack/react-query'
import lodash from 'lodash'
import { useMemo } from 'react'

import { authApi } from '@/lib/api'
import { cookie } from '@/lib/cookie'
import { COOKIES, IMAGES } from '@/lib/utils'
import type { TLoginInput } from '@/lib/validationSchemas'
import { RoleEnum } from '@/shared/enums'
import type { TUser } from '@/shared/types'

import { queryClient } from '../../main'
import { onErrorToast } from './helper'

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
        mutationFn: (data: TLoginInput) => authApi.login(data),
        onSuccess: (res) => {
            const {
                accessToken: { token, expiresAt },
            } = res.data.result
            // Set cookie for authentication
            cookie.set(COOKIES.authentication, token, {
                path: '/',
                expires: parseExpires(expiresAt),
            })
        },
        onError: (err) => {
            onErrorToast(err, (err as unknown as { error: string }).error)
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
            cookie.remove(COOKIES.authentication)

            queryClient.clear?.()
            queryClient.invalidateQueries?.()
            queryClient.removeQueries?.()
        },
    })
}

export function useProfile() {
    const {
        data,
        status,
        isLoading: isQueryLoading,
    } = useQuery({
        queryKey: ['profile'],
        queryFn: () => authApi.getProfile(),
        select: (res) => res.data.result,
    })

    const accessToken = cookie.get(COOKIES.authentication)

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

    const isAdmin = userRole?.code === 'admin'
    const isStaff = userRole?.code === 'staff'
    const isAccounting = userRole?.code === 'accounting'

    return {
        data: profile,
        profile: profile,
        isLoading: isQueryLoading || (status === 'pending' && !!accessToken),
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

    const userRole = profile?.role

    return {
        profile,
        loadingProfile: loadingProfile || fetchingProfile,
        userRole,
    }
}
