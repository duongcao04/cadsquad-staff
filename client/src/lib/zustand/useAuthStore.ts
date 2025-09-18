import { create } from 'zustand'
import { combine } from 'zustand/middleware'

import { User } from '@/validationSchemas/auth.schema'

const getInitUser: () => User = () => {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('auth_user') ?? '{}')
    }
}

export const useAuthStore = create(
    combine(
        {
            authUser: getInitUser(),
        },
        (set) => {
            return {
                setAuthUser: (user: User) => {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('auth_user', JSON.stringify(user))
                    }
                    set(() => ({
                        authUser: user,
                    }))
                },
                removeAuthUser: () => {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('auth_user')
                    }
                    set(() => ({
                        authUser: {} as User,
                    }))
                },
            }
        }
    )
)
