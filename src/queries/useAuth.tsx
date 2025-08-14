'use client'

import useSWR, { SWRConfiguration } from 'swr'

import { supabase } from '@/lib/supabase/client'
import { getProfile } from '@/lib/swr/actions/auth'
import { Login, User } from '@/validationSchemas/auth.schema'

import { setSession } from '../lib/auth/session'

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
        await supabase.auth
            .signInWithPassword({
                email: loginData.email,
                password: loginData.password,
            })
            .then((res) => {
                setSession(res.data.user as User)
            })

        await mutate()
    }

    const logout = async () => {
        mutate(undefined, false)
    }

    return { profile, login, logout }
}
