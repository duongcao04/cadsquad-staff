'use client'

import {
    useCreateUserMutation,
    useDepartments,
    useJobTitles,
} from '@/lib/queries'
import { CreateUserSchema, TCreateUserInput } from '@/lib/validationSchemas'
import { Divider, Spacer } from '@heroui/react'
import { useFormik } from 'formik'
import { Link } from '../../../i18n/navigation'
import { INTERNAL_URLS, ROLES_LIST } from '../../../lib/utils'
import { RoleEnum } from '../../enums'
import { HeroButton } from '../ui/hero-button'
import { HeroCard, HeroCardBody, HeroCardFooter } from '../ui/hero-card'
import HeroCopyButton from '../ui/hero-copy-button'
import { HeroInput } from '../ui/hero-input'
import { HeroSelect, HeroSelectItem } from '../ui/hero-select'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

type CreateUserFormProps = {
    isSuccess?: boolean
    onClose?: () => void
    onSuccess?: (success: boolean) => void
}
export default function CreateUserForm({
    isSuccess = false,
    onClose,
    onSuccess,
}: CreateUserFormProps) {
    const { departments, isLoading: loadingDepartments } = useDepartments()
    const { jobTitles, isLoading: loadingJobTitles } = useJobTitles()
    const roleList = ROLES_LIST

    const createUserMutation = useCreateUserMutation()

    const formik = useFormik<TCreateUserInput>({
        initialValues: {
            displayName: '',
            email: '',
            role: RoleEnum.USER,
            avatar: '',
            phoneNumber: '',
            departmentId: '',
            jobTitleId: '',
            username: '',
        },
        validationSchema: CreateUserSchema,
        onSubmit: async (values) => {
            await createUserMutation.mutateAsync(
                {
                    ...values,
                    email: [values.email, '@cadsquad.vn'].join(''),
                },
                {
                    onSuccess() {
                        onSuccess?.(true)
                    },
                    onError() {
                        onSuccess?.(false)
                    },
                }
            )
        },
    })

    const handleCancel = () => {
        formik.resetForm()
        onClose?.()
    }

    return (
        <div className="w-full">
            <Divider className="bg-text-3!" />

            {isSuccess ? (
                <HeroCard className="py-5 shadow-none border-none">
                    <HeroCardBody className="text-center px-10">
                        <p className="font-bold text-text-8">
                            {formik.values.displayName}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <p className="font-medium text-text-subdued text-sm">
                                {[formik.values.email, '@cadsquad.vn'].join('')}
                            </p>
                            <HeroCopyButton
                                textValue={[
                                    formik.values.email,
                                    '@cadsquad.vn',
                                ].join('')}
                            />
                        </div>
                        <p className="mt-3">
                            User has been created successfully. <br />
                            You may proceed to manage the user’s details and
                            permissions, or select Done to return to your
                            current workflow.
                        </p>
                    </HeroCardBody>
                    <HeroCardFooter className="flex items-center justify-center gap-5">
                        <Link className="block" href={INTERNAL_URLS.manageUser}>
                            <HeroButton className="w-40" variant="bordered">
                                Manage user
                            </HeroButton>
                        </Link>
                        <HeroButton
                            className="w-40"
                            color="success"
                            onPress={onClose}
                        >
                            Done
                        </HeroButton>
                    </HeroCardFooter>
                </HeroCard>
            ) : (
                <form
                    onSubmit={formik.handleSubmit}
                    className="size-full flex flex-col justify-between"
                >
                    {/* 2. Form Content Area */}

                    <ScrollArea className="size-full h-[440px] pl-7 pr-2">
                        <ScrollBar orientation="horizontal" />
                        <ScrollBar orientation="vertical" />

                        <div className="pr-4 py-5">
                            <HeroInput
                                isRequired
                                id="displayName"
                                name="displayName"
                                label="Display Name"
                                placeholder="e.g. Cao Hai Duong"
                                labelPlacement="outside-top"
                                value={formik.values.displayName}
                                onChange={formik.handleChange}
                                isInvalid={
                                    Boolean(formik.touched.displayName) &&
                                    Boolean(formik.errors.displayName)
                                }
                                errorMessage={
                                    Boolean(formik.touched.displayName) &&
                                    (formik.errors.displayName as string)
                                }
                            />

                            <Spacer className="h-3!" />

                            <HeroInput
                                isRequired
                                id="email"
                                name="email"
                                label="Email"
                                placeholder="e.g. example"
                                endContent={<p>@cadsquad.vn</p>}
                                labelPlacement="outside-top"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                isInvalid={
                                    Boolean(formik.touched.email) &&
                                    Boolean(formik.errors.email)
                                }
                                errorMessage={
                                    Boolean(formik.touched.email) &&
                                    (formik.errors.email as string)
                                }
                            />

                            <Spacer className="h-3!" />

                            <HeroSelect
                                isLoading={loadingDepartments}
                                id="departmentId"
                                name="departmentId"
                                label="Department"
                                placeholder="Select one department"
                                labelPlacement="outside"
                                selectedKeys={
                                    formik.values.departmentId
                                        ? [formik.values.departmentId]
                                        : []
                                }
                                onChange={(e) => {
                                    const value = e.target.value
                                    formik.setFieldValue('departmentId', value)
                                    formik.setFieldTouched(
                                        'departmentId',
                                        true,
                                        false
                                    )
                                }}
                                renderValue={(selectedItems) => {
                                    const item = departments?.find(
                                        (d) => d.id === selectedItems[0].key
                                    )
                                    if (!item)
                                        return (
                                            <span className="text-gray-400">
                                                Select one department
                                            </span>
                                        )
                                    return (
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        item.hexColor ||
                                                        'transparent',
                                                }}
                                            />
                                            <span>{item.displayName}</span>
                                        </div>
                                    )
                                }}
                            >
                                {departments.map((department) => (
                                    <HeroSelectItem key={department.id}>
                                        <div className="flex items-center justify-start gap-2">
                                            <div
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        department.hexColor
                                                            ? department.hexColor
                                                            : 'transparent',
                                                }}
                                            />
                                            <p>{department.displayName}</p>
                                        </div>
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>

                            <Spacer className="h-3!" />

                            <HeroSelect
                                isLoading={loadingJobTitles}
                                id="jobTitleId"
                                name="jobTitleId"
                                label="Job title"
                                placeholder="Select one job title"
                                labelPlacement="outside"
                                selectedKeys={
                                    formik.values.jobTitleId
                                        ? [formik.values.jobTitleId]
                                        : []
                                }
                                onChange={(e) => {
                                    const value = e.target.value
                                    formik.setFieldValue('jobTitleId', value)
                                    formik.setFieldTouched(
                                        'jobTitleId',
                                        true,
                                        false
                                    )
                                }}
                                renderValue={(selectedItems) => {
                                    const item = jobTitles?.find(
                                        (d) => d.id === selectedItems[0].key
                                    )
                                    if (!item)
                                        return (
                                            <span className="text-gray-400">
                                                Select one job title
                                            </span>
                                        )
                                    return <span>{item.displayName}</span>
                                }}
                            >
                                {jobTitles?.map((jobTitle) => (
                                    <HeroSelectItem key={jobTitle.id}>
                                        <span>{jobTitle.displayName}</span>
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>

                            <Spacer className="h-3!" />

                            <HeroSelect
                                id="role"
                                name="role"
                                label="Role"
                                placeholder="Select role permission for this user"
                                labelPlacement="outside"
                                selectedKeys={[formik.values.role]}
                                onChange={(e) => {
                                    const value = e.target.value
                                    formik.setFieldValue('role', value)
                                    formik.setFieldTouched('role', true, false)
                                }}
                            >
                                {roleList?.map((role) => (
                                    <HeroSelectItem key={role.value}>
                                        {role.label}
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>
                        </div>
                    </ScrollArea>

                    <Divider className="bg-text-3!" />

                    {/* 3. Footer / Action Buttons */}
                    <div className="bg-background flex items-center justify-end gap-4 pr-7 pt-4 pb-2">
                        <HeroButton
                            type="button"
                            color="default"
                            variant="light"
                            onPress={handleCancel}
                        >
                            Cancel
                        </HeroButton>
                        <HeroButton
                            color="primary"
                            type="submit"
                            isLoading={createUserMutation.isPending}
                        >
                            Create User
                        </HeroButton>
                    </div>
                </form>
            )}
        </div>
    )
}
