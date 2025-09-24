import * as yup from 'yup'

export const LoginInputSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
})
export type LoginInput = yup.InferType<typeof LoginInputSchema>

