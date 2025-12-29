import type { TUser } from '../types'

export interface ICommentResponse {
    id?: string
    content?: string
    jobId?: string
    userId?: string
    user?: TUser
    parentId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
}
