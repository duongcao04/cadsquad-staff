'use client'

import { ApiResponse } from '@/lib/axios'
import { useUpdatePasswordMutation } from '@/lib/queries'
import {
    TUpdatePasswordInput,
    UpdatePasswordInputSchema,
} from '@/lib/validationSchemas'
import { addToast, Button, Input, InputProps } from '@heroui/react'
import { AxiosError } from 'axios'
import { useFormik } from 'formik'

const inputClassNames: InputProps['classNames'] = {
    label: 'pb-1',
    inputWrapper: 'border-[1px]',
}

export function ChangePasswordForm() {
    const { mutateAsync: updatePasswordMutate, isPending: isUpdatingPassword } =
        useUpdatePasswordMutation()
    const formik = useFormik<TUpdatePasswordInput>({
        validationSchema: UpdatePasswordInputSchema,
        initialValues: {
            oldPassword: '',
            newPassword: '',
            newConfirmPassword: '',
        },
        onSubmit: async (values) => {
            try {
                const res = await updatePasswordMutate({
                    updatePasswordInput: values,
                })

                if (res.data.success) {
                    addToast({
                        title: 'Đổi mật khẩu thành công',
                        color: 'success',
                    })
                } else {
                    throw new Error('Đổi mật khẩu thất bại')
                }
            } catch (err) {
                const error = err as AxiosError<
                    ApiResponse<{ message: string }>
                >
                const message =
                    error.response?.data?.message ??
                    error.response?.data?.result?.message ??
                    error.message ??
                    'Đã xảy ra lỗi'

                addToast({
                    title: message,
                    color: 'danger',
                })
            }
        },
    })

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="size-full border-px border-text-muted rounded-xl px-6 pt-4 pb-7">
                <h2 className="text-base font-semibold">Đổi mật khẩu</h2>
                <div className="mt-4 space-y-3">
                    <Input
                        isRequired
                        id="oldPassword"
                        name="oldPassword"
                        label="Old Password"
                        labelPlacement="outside-top"
                        placeholder="••••••••"
                        // type="password"
                        classNames={inputClassNames}
                        variant="bordered"
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        isInvalid={
                            Boolean(formik.touched.oldPassword) &&
                            Boolean(formik.errors.oldPassword)
                        }
                        errorMessage={
                            Boolean(formik.touched.oldPassword) &&
                            formik.errors.oldPassword
                        }
                    />
                    <Input
                        isRequired
                        id="newPassword"
                        name="newPassword"
                        label="New Password"
                        labelPlacement="outside-top"
                        placeholder="••••••••"
                        // type="password"
                        classNames={inputClassNames}
                        variant="bordered"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        isInvalid={
                            Boolean(formik.touched.newPassword) &&
                            Boolean(formik.errors.newPassword)
                        }
                        errorMessage={
                            Boolean(formik.touched.newPassword) &&
                            formik.errors.newPassword
                        }
                    />
                    <Input
                        isRequired
                        id="newConfirmPassword"
                        name="newConfirmPassword"
                        label="Confirm New Password"
                        labelPlacement="outside-top"
                        placeholder="••••••••"
                        // type="password"
                        classNames={inputClassNames}
                        variant="bordered"
                        value={formik.values.newConfirmPassword}
                        onChange={formik.handleChange}
                        isInvalid={
                            Boolean(formik.touched.newConfirmPassword) &&
                            Boolean(formik.errors.newConfirmPassword)
                        }
                        errorMessage={
                            Boolean(formik.touched.newConfirmPassword) &&
                            formik.errors.newConfirmPassword
                        }
                    />
                    <div className="mt-5 flex items-center justify-start gap-4">
                        <Button
                            type="submit"
                            className="w-[120px]"
                            color="primary"
                            isLoading={isUpdatingPassword}
                        >
                            Lưu thay đổi
                        </Button>
                        <Button
                            type="submit"
                            className="w-[120px] border-[1.5px]"
                            variant="bordered"
                            color="danger"
                        >
                            Hủy
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}
