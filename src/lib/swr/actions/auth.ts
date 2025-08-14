import { AUTH_API } from '@/queries/useAuth'

import { User } from '@/validationSchemas/auth.schema'

export const getProfile: () => Promise<User> = async () => {
    const res = await fetch(`${AUTH_API}/profile`, {
        method: 'GET',
    })
    const data = await res.json()
    return data.data
}
