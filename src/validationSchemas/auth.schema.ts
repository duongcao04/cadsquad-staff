import * as yup from 'yup'

export const LoginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
})
export type Login = yup.InferType<typeof LoginSchema>

export const UserSchema = yup.object().shape({
    id: yup.string(),
    email: yup.string(),
    avatar: yup.string(),
    username: yup.string(),
    name: yup.string(),
    jobTitle: yup.string(),
    department: yup.string(),
    phoneNumber: yup.string(),

    // Optional enum validation
    role: yup
        .mixed<'USER' | 'ADMIN' | 'ACCOUNTING'>()
        .oneOf(['USER', 'ADMIN', 'ACCOUNTING'], 'Invalid role')
        .default('USER'),

    // These fields are typically system-generated, so they are not usually validated on user input
    createdAt: yup.string(),
    updatedAt: yup.string(),
})
export type User = yup.InferType<typeof UserSchema>
