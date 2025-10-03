'use client'

import { Image } from 'antd'
import React, { useMemo, useState } from 'react'
import useAuth from '@/shared/queries/useAuth'
import { addToast, Button, Input, InputProps, Skeleton } from '@heroui/react'
import { useFormik } from 'formik'
import { Link } from '@/i18n/navigation'
import { UpdateUserInput } from '@/shared/validationSchemas/user.schema'
import { useUpdateUserMutation } from '@/shared/queries/useUser'
import { userApi } from '@/app/api/user.api'

export default function UpdateAccountForm() {
    const { mutateAsync: updateUserMutate, isPending: isUpdatingUser } =
        useUpdateUserMutation()
    const { profile, loadingProfile } = useAuth()
    const [usernameValid, setUsernameValid] = useState(true)

    const getPhoneNumber = (phoneNum: string) => {
        if (phoneNum.startsWith('0')) {
            return phoneNum.replace('0', '')
        }
        if (phoneNum.startsWith('+84')) {
            return phoneNum.replace('+84', '')
        }
        return phoneNum
    }
    const initialValues = useMemo<UpdateUserInput>(
        () => ({
            avatar: profile?.avatar ?? '',
            departmentId: profile?.department?.id ?? '',
            username: profile?.username ?? '',
            email: profile?.email ?? '',
            jobTitleIds: profile?.jobTitles.map((i) => i.id) ?? [],
            displayName: profile?.displayName ?? '',
            phoneNumber: getPhoneNumber(profile?.phoneNumber ?? ''),
        }),
        [profile]
    )

    const formik = useFormik<UpdateUserInput>({
        initialValues,
        enableReinitialize: true,
        onSubmit(values) {
            try {
                const updateInput = {
                    username: values.username,
                    email: values.email,
                    displayName: values.displayName,
                    phoneNumber: `0${values.phoneNumber}`,
                }
                updateUserMutate({
                    userId: profile?.id,
                    updateUserInput: updateInput,
                })
                addToast({
                    title: 'Cập nhật thông tin thành công',
                    color: 'success',
                })
            } catch (error) {
                console.log(error)
                addToast({
                    title: 'Đã xảy ra lỗi',
                    color: 'danger',
                })
            }
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
                                    isLoaded={!loadingProfile}
                                    className="w-fit h-fit rounded-md"
                                >
                                    <p className="text-text1p5 text-sm">
                                        Email
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={!loadingProfile}
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
                                    isLoaded={!loadingProfile}
                                    className="w-fit h-fit rounded-md"
                                >
                                    <p className="text-text1p5 text-sm">
                                        Full name
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={!loadingProfile}
                                    className="w-full h-fit rounded-md"
                                >
                                    <Input
                                        id="displayName"
                                        name="displayName"
                                        classNames={inputClassNames}
                                        variant="bordered"
                                        value={formik.values.displayName}
                                        onChange={formik.handleChange}
                                    />
                                </Skeleton>
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton
                                    isLoaded={!loadingProfile}
                                    className="w-fit h-fit rounded-md"
                                >
                                    <p className="text-text1p5 text-sm">
                                        Username
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={!loadingProfile}
                                    className="w-full h-fit rounded-md"
                                >
                                    <Input
                                        id="username"
                                        name="username"
                                        startContent={<p>@</p>}
                                        classNames={inputClassNames}
                                        variant="bordered"
                                        value={formik.values.username}
                                        onChange={async (e) => {
                                            const value = e.target.value
                                            formik.setFieldValue(
                                                'username',
                                                value
                                            )
                                            const isValid = await userApi
                                                .checkUsernameValid(value)
                                                .then(
                                                    (res) =>
                                                        res.data.result?.isValid
                                                )
                                            setUsernameValid(Boolean(isValid))
                                        }}
                                        isInvalid={!usernameValid}
                                        errorMessage={'Username đã tồn tại'}
                                    />
                                </Skeleton>
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton
                                    isLoaded={!loadingProfile}
                                    className="w-fit h-fit rounded-md"
                                >
                                    <p className="text-text1p5 text-sm">
                                        Department
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={!loadingProfile}
                                    className="w-full h-fit rounded-md"
                                >
                                    <Input
                                        id="department"
                                        name="department"
                                        classNames={inputClassNames}
                                        variant="bordered"
                                        value={profile?.department?.displayName}
                                        isDisabled
                                    />
                                </Skeleton>
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton
                                    isLoaded={!loadingProfile}
                                    className="w-fit h-fit rounded-md"
                                >
                                    <p className="text-text1p5 text-sm">
                                        Job Title
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={!loadingProfile}
                                    className="w-full h-fit rounded-md"
                                >
                                    <Input
                                        id="jobTitle"
                                        name="jobTitle"
                                        classNames={inputClassNames}
                                        variant="bordered"
                                        // value={formik.values.jobTitle[0]}
                                        onChange={formik.handleChange}
                                        isDisabled
                                    />
                                </Skeleton>
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton
                                    isLoaded={!loadingProfile}
                                    className="w-fit h-fit rounded-md"
                                >
                                    <p className="text-text1p5 text-sm">
                                        Phone number
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={!loadingProfile}
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
                                isLoaded={!loadingProfile}
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
                                onPress={() => {
                                    alert('Tính năng đang được phát triển')
                                }}
                            >
                                Chọn ảnh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Button
                type="submit"
                className="px-8"
                color="primary"
                isLoading={isUpdatingUser}
            >
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
