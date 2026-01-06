import { useMutation, useQuery } from '@tanstack/react-query'
import lodash from 'lodash'
import { useMemo } from 'react'
import { authApi } from '@/lib/api'
import { cookie } from '@/lib/cookie'
import { COOKIES, IMAGES } from '@/lib/utils'
import type { TLoginInput, TUpdateProfileInput } from '@/lib/validationSchemas'
import type { TUser } from '@/shared/types'
import { queryClient } from '../../main'
import { onErrorToast } from './helper'
import { ApiResponse } from '../axios'
import { addToast } from '@heroui/react'

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
            // 1. Trích xuất dữ liệu từ body
            const {
                accessToken: { token, expiresAt },
                sessionId, // Backend nên trả về sessionId trong body hoặc trích xuất từ res.headers
            } = res.data.result

            // 2. Set cookie cho Authentication (Token)
            cookie.set(COOKIES.authentication, token, {
                path: '/',
                expires: parseExpires(expiresAt),
                sameSite: 'strict', // Khuyên dùng để tăng bảo mật
            })

            // 3. Set cookie cho Session ID
            // Nếu Backend trả về sessionId trong result body:
            if (sessionId) {
                cookie.set(COOKIES.sessionId, sessionId, {
                    path: '/',
                    expires: parseExpires(expiresAt), // Hết hạn cùng token
                })
            }
            // Hoặc nếu bạn muốn lấy từ Response Header (x-session-id):
            else {
                const headerSessionId = res.headers['x-session-id']
                if (headerSessionId) {
                    cookie.set(COOKIES.sessionId, headerSessionId, {
                        path: '/',
                        expires: parseExpires(expiresAt),
                    })
                }
            }
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
            role: data?.role,
            securityLogs: data?.securityLogs ?? [],
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

export const useUpdateProfileMutation = (
    onSuccess?: (res: ApiResponse<TUser>) => void
) => {
    return useMutation({
        mutationFn: async (data: TUpdateProfileInput) =>
            await authApi.updateProfile(data),
        onSuccess: (res) => {
            queryClient.refetchQueries({ queryKey: ['profile'] })
            if (onSuccess) {
                onSuccess(res)
            } else {
                addToast({
                    title: res.message,
                    color: 'success',
                })
            }
        },
        onError: (err) => onErrorToast(err, 'Failed to update profile'),
    })
}
