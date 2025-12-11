import * as yup from 'yup'

export const CreateUserSchema = yup.object().shape({
    email: yup.string().required('Email is required'),
    avatar: yup.string(),
    username: yup.string().optional(),
    password: yup.string().optional(),
    displayName: yup.string().required('Display name is required'),
    jobTitleId: yup.string().optional(),
    departmentId: yup.string().optional(),
    phoneNumber: yup.string().optional(),

    // Optional enum validation
    role: yup
        .mixed<'USER' | 'ADMIN' | 'ACCOUNTING'>()
        .oneOf(['USER', 'ADMIN', 'ACCOUNTING'], 'Invalid role')
        .default('USER'),
})
export type TCreateUserInput = yup.InferType<typeof CreateUserSchema>

export const UpdateUserSchema = CreateUserSchema.partial()
export type TUpdateUserInput = yup.InferType<typeof UpdateUserSchema>
