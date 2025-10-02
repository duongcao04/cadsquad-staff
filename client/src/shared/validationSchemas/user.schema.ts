import * as yup from 'yup'

export const CreateUserSchema = yup.object().shape({
    email: yup.string().email().required(),
    avatar: yup.string(),
    displayName: yup.string().required(),
    jobTitleIds: yup.array(yup.string().required()).optional(),
    departmentId: yup.string().optional(),
    phoneNumber: yup.string(),

    // Optional enum validation
    role: yup
        .mixed<'USER' | 'ADMIN' | 'ACCOUNTING'>()
        .oneOf(['USER', 'ADMIN', 'ACCOUNTING'], 'Invalid role')
        .default('USER'),
})
export type CreateUserInput = yup.InferType<typeof CreateUserSchema>

export const UpdateUserSchema = CreateUserSchema.partial()
export type UpdateUserInput = yup.InferType<typeof UpdateUserSchema>
