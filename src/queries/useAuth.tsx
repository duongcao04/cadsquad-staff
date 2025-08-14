'use client'

import useSWR, { SWRConfiguration } from 'swr'

import { setCustomSession, setSession } from '@/lib/auth/session'
import { axiosClient } from '@/lib/axios'
import { supabase } from '@/lib/supabase/client'
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
        await axiosClient
            .post('auth/login', JSON.stringify(loginData))
            .then((res) => {
                const { data } = res
                console.log(data.result)
            })
    }

    const logout = async () => {
        mutate(undefined, false)
    }

    return { profile, login, logout }
}
