import { optimizeCloudinary } from '@/lib'
import { userApi } from '@/lib/api'
import { useProfile, useUpdateUserMutation } from '@/lib/queries'
import { IMAGES } from '@/lib/utils'
import { type TUpdateUserInput } from '@/lib/validationSchemas'
import {
    addToast,
    Button,
    Input,
    type InputProps,
    Skeleton,
    useDisclosure,
} from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { Image } from 'antd'
import { useFormik } from 'formik'
import { useMemo, useState } from 'react'
import UploadAvatarModal from './UploadAvatarModal'

const getPhoneNumber = (phoneNum: string) => {
    if (phoneNum.startsWith('0')) {
        return phoneNum.replace('0', '')
    }
    if (phoneNum.startsWith('+84')) {
        return phoneNum.replace('+84', '')
    }
    return phoneNum
}

export function UpdateAccountForm() {
    const { isAdmin, profile, isLoading: loadingProfile } = useProfile()

    const {
        isOpen: isOpenUploadAvatarModal,
        onOpen: onOpenUploadAvatarModal,
        onClose: onCloseUploadAvatarModal,
    } = useDisclosure({
        id: 'UploadAvatarModal',
    })

    const { mutateAsync: updateUserMutate, isPending: isUpdatingUser } =
        useUpdateUserMutation()

    const [usernameValid, setUsernameValid] = useState(true)

    const initialValues = useMemo<TUpdateUserInput>(
        () => ({
            avatar: profile?.avatar ?? IMAGES.emptyAvatar,
            departmentId: profile?.department?.id ?? '',
            username: profile?.username ?? '',
            email: profile?.email ?? '',
            jobTitleId: profile?.jobTitle?.id ?? '',
            displayName: profile?.displayName ?? '',
            phoneNumber: getPhoneNumber(profile?.phoneNumber ?? ''),
        }),
        [profile]
    )

    const formik = useFormik<TUpdateUserInput>({
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
        <>
            <UploadAvatarModal
                userId={profile.id}
                isOpen={isOpenUploadAvatarModal}
                onClose={onCloseUploadAvatarModal}
            />
            <form onSubmit={formik.handleSubmit} className="space-y-8">
                <div className="size-full border-px border-text-muted rounded-xl px-6 pt-4 pb-7">
                    <h2 className="text-base font-semibold">
                        General information
                    </h2>
                    <div>
                        <div className="mt-4 grid grid-cols-[1fr_0.35fr] gap-16">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Skeleton
                                        isLoaded={!loadingProfile}
                                        className="w-fit h-fit rounded-md"
                                    >
                                        <p className="text-text-default text-sm">
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
                                            description="Your contact email address, used for notifications and account verification."
                                            isDisabled={!isAdmin}
                                        />
                                    </Skeleton>
                                </div>
                                <div className="space-y-1.5">
                                    <Skeleton
                                        isLoaded={!loadingProfile}
                                        className="w-fit h-fit rounded-md"
                                    >
                                        <p className="text-text-default text-sm">
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
                                            description="Your full name as registered in the system, displayed in your profile and across the platform."
                                            onChange={formik.handleChange}
                                        />
                                    </Skeleton>
                                </div>
                                <div className="space-y-1.5">
                                    <Skeleton
                                        isLoaded={!loadingProfile}
                                        className="w-fit h-fit rounded-md"
                                    >
                                        <p className="text-text-default text-sm">
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
                                            description="The account name you use to log in to the system."
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
                                                            res.data.result
                                                                ?.isValid
                                                    )
                                                setUsernameValid(
                                                    Boolean(isValid)
                                                )
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
                                        <p className="text-text-default text-sm">
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
                                            description="The department you belong to within the company."
                                            value={
                                                profile?.department?.displayName
                                            }
                                            isDisabled={!isAdmin}
                                        />
                                    </Skeleton>
                                </div>
                                <div className="space-y-1.5">
                                    <Skeleton
                                        isLoaded={!loadingProfile}
                                        className="w-fit h-fit rounded-md"
                                    >
                                        <p className="text-text-default text-sm">
                                            Job title
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
                                            description="Your position or role within the company."
                                            // value={formik.values.jobTitle[0]}
                                            onChange={formik.handleChange}
                                            isDisabled={!isAdmin}
                                        />
                                    </Skeleton>
                                </div>
                                <div className="space-y-1.5">
                                    <Skeleton
                                        isLoaded={!loadingProfile}
                                        className="w-fit h-fit rounded-md"
                                    >
                                        <p className="text-text-default text-sm">
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
                                            description="Your contact phone number, used for calls or SMS notifications."
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
                                        src={optimizeCloudinary(
                                            formik.values.avatar ??
                                                IMAGES.loadingPlaceholder,
                                            {
                                                width: 256,
                                                height: 256,
                                            }
                                        )}
                                        alt="User avatar"
                                        className="w-full aspect-square rounded-full object-cover"
                                        rootClassName="ring-2 p-1 w-full aspect-square rounded-full overflow-hidden"
                                        preview={{
                                            src: formik.values.avatar,
                                        }}
                                    />
                                </Skeleton>
                                <Button
                                    type="button"
                                    size="sm"
                                    className="px-8"
                                    color="primary"
                                    onPress={onOpenUploadAvatarModal}
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
                        to={'/settings/password_and_security'}
                        className="text-primary-600 underline"
                    >
                        đây
                    </Link>
                </p>
            </form>
        </>
    )
}
