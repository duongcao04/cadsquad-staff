import { User } from '@/validationSchemas/auth.schema'

import { USER_API } from '../api'

export const getUsers: () => Promise<User[]> = async () => {
    const res = await fetch(USER_API, {
        method: 'GET',
    })
    const data = await res.json()
    return data.data.records
}
