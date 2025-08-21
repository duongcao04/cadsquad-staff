import React from 'react'
import { Button, Input, InputProps } from '@heroui/react'
import { useFormik } from 'formik'

export default function ChangePasswordForm() {
    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmNewPasswod: '',
        },
        enableReinitialize: true,
        onSubmit(values) {
            console.log(values)
        },
    })

    const inputClassNames: InputProps['classNames'] = {
        label: 'pb-1',
        inputWrapper: 'border-[1px]',
    }

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="size-full border-[1px] border-text3 rounded-xl px-6 pt-4 pb-7">
                <h2 className="text-base font-semibold">Đổi mật khẩu</h2>
                <div className="mt-4 space-y-3">
                    <Input
                        id="oldPassword"
                        name="oldPassword"
                        label="Old Password"
                        labelPlacement="outside-top"
                        placeholder="••••••••"
                        classNames={inputClassNames}
                        variant="bordered"
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                    />
                    <Input
                        id="newPassword"
                        name="newPassword"
                        label="New Password"
                        labelPlacement="outside-top"
                        placeholder="••••••••"
                        classNames={inputClassNames}
                        variant="bordered"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                    />
                    <Input
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        label="Confirm New Password"
                        labelPlacement="outside-top"
                        placeholder="••••••••"
                        classNames={inputClassNames}
                        variant="bordered"
                        value={formik.values.confirmNewPasswod}
                        onChange={formik.handleChange}
                    />
                    <div className="mt-5 flex items-center justify-start gap-4">
                        <Button
                            type="submit"
                            className="w-[120px]"
                            color="primary"
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
