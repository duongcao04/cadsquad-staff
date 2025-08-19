'use client'

import { ApiResponse, axiosClient } from '@/lib/axios'
import { Login } from '@/validationSchemas/auth.schema'
import { cookie } from '@/lib/cookie'
import { useQuery } from '@tanstack/react-query'
import { User } from '@/validationSchemas/user.schema'

export const AUTH_API = '/api/auth'

export default function useAuth() {
    const profile = useQuery({
        queryKey: ['profile'],
        queryFn: () => axiosClient.get<ApiResponse<User>>('auth/profile'),
        select: (res) => res.data.result,
    })

    const login = async (loginData: Login) => {
        return await axiosClient
            .post('auth/login', JSON.stringify(loginData))
            .then(async (res) => {
                const { accessToken, expiresIn } = res.data.result
                // Set cookie for authentication
                cookie.set('session', accessToken, {
                    path: '/',
                    maxAge: expiresIn,
                })
            })
    }

    const logout = async () => {
        return cookie.remove('session')
    }

    return { profile, login, logout }
}
