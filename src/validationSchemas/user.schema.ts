import * as yup from 'yup'

import {User as UserPrisma} from '@prisma/client'

export type User = Partial<UserPrisma>
export const CreateUserSchema = yup.object().shape({
    email: yup.string().email().required(),
    avatar: yup.string(),
    name: yup.string().required(),
    jobTitle: yup.string().required(),
    department: yup.string().required(),
    phoneNumber: yup.string(),

    // Optional enum validation
    role: yup
        .mixed<'USER' | 'ADMIN' | 'ACCOUNTING'>()
        .oneOf(['USER', 'ADMIN', 'ACCOUNTING'], 'Invalid role')
        .default('USER'),
})
export type NewUser = yup.InferType<typeof CreateUserSchema>