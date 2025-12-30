import { TTopic } from '../types'

export interface ICommunityResponse {
    id?: string
    code?: string
    displayName?: string
    description?: string | null
    color?: string | null
    icon?: string
    banner?: string | null
    topics?: TTopic[]
    createdAt?: Date | string
    updatedAt?: Date | string
}
