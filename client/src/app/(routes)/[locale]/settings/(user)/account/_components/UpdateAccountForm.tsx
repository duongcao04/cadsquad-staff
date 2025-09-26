import { Image } from 'antd'
import React from 'react'
import useAuth from '@/shared/queries/useAuth'
import { Button, Input, InputProps, Skeleton } from '@heroui/react'
import { useFormik } from 'formik'
import { Link } from '@/i18n/navigation'

export default function UpdateAccountForm({
    isLoading,
}: {
    isLoading: boolean
}) {
    const {
        profile: { data },
    } = useAuth()

    const initialValues = {
        email: data?.email,
        name: data?.displayName,
        username: data?.username,
        department: data?.department?.displayName ?? '',
        jobTitle: data?.jobTitles ?? '',
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
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Skeleton
                                    isLoaded={!isLoading}
                                    className="w-fit h-fit rounded-md"
                                >
                                    <p className="text-text1p5 text-sm">
                                        Email
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={!isLoading}
                                    className="w-full h-fit rounded-md"
                                >
                                    <Input
                                        id="email"
                                        name="email"
                                        value={formik.values.email}
                                        classNames={inputClassNames}
                                        variant="bordered"
                                        isDisabled
                                    />
                                </Skeleton>
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton
                                    isLoaded={!isLoading}
                                    className="w-fit h-fit rounded-md"
                                >
                                    <p className="text-text1p5 text-sm">
                                        Full name
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={!isLoading}
                                    className="w-full h-fit rounded-md"
                                >
                                    <Input
                                        id="name"
                                        name="name"
                                        classNames={inputClassNames}
                                        variant="bordered"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                    />
                                </Skeleton>
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton
                                    isLoaded={!isLoading}
                                    className="w-fit h-fit rounded-md"
                                >
                                    <p className="text-text1p5 text-sm">
                                        Username
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={!isLoading}
                                    className="w-full h-fit rounded-md"
                                >
                                    <Input
                                        id="username"
                                        name="username"
                                        startContent={<p>@</p>}
                                        classNames={inputClassNames}
                                        variant="bordered"
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                    />
                                </Skeleton>
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton
                                    isLoaded={!isLoading}
                                    className="w-fit h-fit rounded-md"
                                >
                                    <p className="text-text1p5 text-sm">
                                        Department
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={!isLoading}
                                    className="w-full h-fit rounded-md"
                                >
                                    <Input
                                        id="department"
                                        name="department"
                                        classNames={inputClassNames}
                                        variant="bordered"
                                        value={formik.values.department}
                                        onChange={formik.handleChange}
                                    />
                                </Skeleton>
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton
                                    isLoaded={!isLoading}
                                    className="w-fit h-fit rounded-md"
                                >
                                    <p className="text-text1p5 text-sm">
                                        Job Title
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={!isLoading}
                                    className="w-full h-fit rounded-md"
                                >
                                    <Input
                                        id="jobTitle"
                                        name="jobTitle"
                                        classNames={inputClassNames}
                                        variant="bordered"
                                        value={formik.values.jobTitle[0]}
                                        onChange={formik.handleChange}
                                    />
                                </Skeleton>
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton
                                    isLoaded={!isLoading}
                                    className="w-fit h-fit rounded-md"
                                >
                                    <p className="text-text1p5 text-sm">
                                        Phone number
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={!isLoading}
                                    className="w-full h-fit rounded-md"
                                >
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        classNames={inputClassNames}
                                        startContent={
                                            <p className="text-sm">+84</p>
                                        }
                                        variant="bordered"
                                        value={formik.values.phoneNumber}
                                        onChange={formik.handleChange}
                                    />
                                </Skeleton>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-6">
                            <Skeleton
                                className="w-full aspect-square rounded-full"
                                isLoaded={!isLoading}
                            >
                                <Image
                                    src={formik.values.avatar}
                                    alt="User avatar"
                                    rootClassName="ring-2 p-1 w-full aspect-square rounded-full overflow-hidden"
                                    className="w-full aspect-square rounded-full"
                                    preview={true}
                                />
                            </Skeleton>
                            <Button
                                type="button"
                                size="sm"
                                className="px-8"
                                color="primary"
                            >
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
                    href={'/settings/personal/security'}
                    className="text-primary-600 underline"
                >
                    đây
                </Link>
            </p>
        </form>
    )
}
