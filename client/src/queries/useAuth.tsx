'use client'

import { ApiResponse, axiosClient } from '@/lib/axios'
import { cookie } from '@/lib/cookie'
import { useQuery } from '@tanstack/react-query'
import { LoginInput } from '@/validationSchemas/auth.schema'
import { User } from '@/types/user.type'

export const AUTH_API = '/api/auth'

export default function useAuth() {
    const profile = useQuery({
        queryKey: ['profile'],
        queryFn: () => axiosClient.get<ApiResponse<User>>('auth/profile'),
        select: (res) => res.data.result,
    })

    const userRole = profile.data?.role

    const login = async (loginInput: LoginInput) => {
        return await axiosClient
            .post('auth/login', JSON.stringify(loginInput))
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
