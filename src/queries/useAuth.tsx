'use client'

import useSWR, { SWRConfiguration } from 'swr'
import Cookies from 'universal-cookie'

import { axiosClient } from '@/lib/axios'
import { getProfile } from '@/lib/swr/actions/auth'
import { Login, User } from '@/validationSchemas/auth.schema'

export const AUTH_API = '/api/auth'

export default function useAuth(options?: SWRConfiguration<User>) {
    const { data: profile, mutate } = useSWR(
        `${AUTH_API}/profile`,
        () => getProfile(),
        {
            dedupingInterval: 60 * 60 * 1000,
            revalidateOnFocus: false,
            ...options,
        }
    )

    const login = async (loginData: Login) => {
        const cookies = new Cookies()
        return await axiosClient
            .post('auth/login', JSON.stringify(loginData))
            .then(async (res) => {
                const { accessToken, expiresIn } = res.data.result
                // Set cookie for authentication
                cookies.set('session', accessToken, {
                    path: '/',
                    maxAge: expiresIn,
                })
            })
    }

    const logout = async () => {
        mutate(undefined, false)
    }

    return { profile, login, logout }
}
