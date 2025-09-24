import { Image } from 'antd'
import React from 'react'
import useAuth from '@/shared/queries/useAuth'
import { Button, Input, InputProps } from '@heroui/react'
import { useFormik } from 'formik'
import { Link } from '@/i18n/navigation'

export default function UpdateAccountForm() {
    const {
        profile: { data },
    } = useAuth()

    const initialValues = {
        email: data?.email,
        name: data?.name,
        username: data?.username,
        department: data?.department ?? '',
        jobTitle: data?.jobTitle ?? '',
        phoneNumber: data?.phoneNumber ?? '',
        avatar: data?.avatar ?? '',
    }

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        onSubmit(values) {
            console.log(values)
        },
    })

    const inputClassNames: InputProps['classNames'] = {
        label: 'pb-0',
        inputWrapper: 'border-[1px]',
    }

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="size-full border-[1px] border-text3 rounded-xl px-6 pt-4 pb-7">
                <h2 className="text-base font-semibold">Thông tin chung</h2>
                <div>
                    <div className="mt-4 grid grid-cols-[1fr_0.35fr] gap-16">
                        <div className="space-y-3">
                            <Input
                                id="email"
                                name="email"
                                label="Email"
                                labelPlacement="outside-top"
                                value={formik.values.email}
                                classNames={inputClassNames}
                                variant="bordered"
                                isDisabled
                            />
                            <Input
                                id="name"
                                name="name"
                                label="Full Name"
                                labelPlacement="outside-top"
                                classNames={inputClassNames}
                                variant="bordered"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                            <Input
                                id="username"
                                name="username"
                                label="Username"
                                labelPlacement="outside-top"
                                startContent={<p>@</p>}
                                classNames={inputClassNames}
                                variant="bordered"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                            />
                            <Input
                                id="department"
                                name="department"
                                label="Department"
                                labelPlacement="outside-top"
                                classNames={inputClassNames}
                                variant="bordered"
                                value={formik.values.department}
                                onChange={formik.handleChange}
                            />
                            <Input
                                id="jobTitle"
                                name="jobTitle"
                                label="Job Title"
                                labelPlacement="outside-top"
                                classNames={inputClassNames}
                                variant="bordered"
                                value={formik.values.jobTitle}
                                onChange={formik.handleChange}
                            />
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                label="Phone Number"
                                labelPlacement="outside-top"
                                classNames={inputClassNames}
                                variant="bordered"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-8">
                            <Image
                                src={formik.values.avatar}
                                alt="User avatar"
                                rootClassName="w-full aspect-square rounded-full"
                                className="w-full aspect-square rounded-full"
                                preview={false}
                            />
                            <Button type="button" size="sm" className="px-8">
                                Chọn ảnh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Button type="submit" className="px-8" color="primary">
                Cập nhật
            </Button>
            <p className="text-sm">
                Đổi mật khẩu, nhấn vào{' '}
                <Link
                    href={'/settings/security'}
                    className="text-primary-600 underline"
                >
                    đây
                </Link>
            </p>
        </form>
    )
}
