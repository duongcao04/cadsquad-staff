import * as yup from 'yup'

export const LoginInputSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
})
export type LoginInput = yup.InferType<typeof LoginInputSchema>

export const UpdatePasswordInputSchema = yup.object().shape({
    oldPassword: yup
        .string()
        .required("Old password is required")
    ,
    newPassword: yup
        .string()
        .required("New password is required")
        .matches(
            /^.{8,}$/,
            "Password must be at least 8 characters"
        ),

    newConfirmPassword: yup
        .string()
        .required("Please confirm your new password")
        .oneOf([yup.ref("newPassword")], "Passwords must match")
    ,
})
export type TUpdatePasswordInput = yup.InferType<typeof UpdatePasswordInputSchema>


export const ResetPasswordSchema = yup.object().shape({
    newPassword: yup
        .string()
        .required("New password is required")
        .matches(
            /^.{8,}$/,
            "Password must be at least 8 characters"
        ),
})
export type TResetPasswordInput = yup.InferType<typeof ResetPasswordSchema>

