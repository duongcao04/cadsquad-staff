import * as yup from 'yup'

export const LoginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
})
export type Login = yup.InferType<typeof LoginSchema>

