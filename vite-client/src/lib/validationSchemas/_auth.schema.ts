import * as yup from 'yup'

export const LoginInputSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
})
export type TLoginInput = yup.InferType<typeof LoginInputSchema>
const passwordSchema = yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)');
export const UpdatePasswordInputSchema = yup.object({
    oldPassword: yup
        .string()
        .required('Old password is required'),
    newPassword: passwordSchema,
    newConfirmPassword: yup
        .string()
        .required('Please confirm your new password')
        .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

export type TUpdatePasswordInput = yup.InferType<typeof UpdatePasswordInputSchema>;

export const ResetPasswordSchema = yup.object().shape({
    newPassword: yup
        .string()
        .required('New password is required')
        .matches(/^.{8,}$/, 'Password must be at least 8 characters'),
})
export type TResetPasswordInput = yup.InferType<typeof ResetPasswordSchema>
