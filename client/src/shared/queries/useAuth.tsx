'use client'

import { authApi } from '@/app/api/auth.api'
import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { ApiError } from '@/lib/axios'
import { cookie } from '@/lib/cookie'
import { authSocket } from '@/lib/socket'
import { RoleEnum } from '@/shared/enums/role.enum'
import { LoginInput } from '@/shared/validationSchemas/auth.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

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

            const socket = authSocket()
            // GÁN token vào handshake trước khi connect
            socket.auth = { token }
            socket.connect()

            socket.once('connect', () => {
                // Không bắt buộc phải emit 'login' nếu server đã auth theo handshake,
                // nhưng nếu bạn cần một event ứng dụng:
                socket.emit('login')
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
            const token = cookie.get('authentication')
            const socket = authSocket()
            cookie.remove('authentication')
            // Nếu server cần token trong event:
            socket.emit('logout', { token })
            socket.disconnect()


            queryClient.clear?.()
            queryClient.invalidateQueries?.()
            queryClient.removeQueries?.()
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

    const accessToken = cookie.get('authentication')

    const userRole = profile?.role as RoleEnum

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
