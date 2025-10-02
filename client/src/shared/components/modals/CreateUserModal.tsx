'use client'

import React from 'react'

import { Button, InputProps, addToast } from '@heroui/react'
import { Modal } from 'antd'
import { useFormik } from 'formik'
import { useKeyboardShortcuts } from 'use-keyboard-shortcuts'

import { capitalize } from '@/lib/utils'
import { RoleEnum } from '@/shared/enums/role.enum'
import {
    CreateUserInput,
    CreateUserSchema,
} from '@/shared/validationSchemas/user.schema'
import HeroInput from '../customize/HeroInput'
import { HeroSelect, HeroSelectItem } from '../customize/HeroSelect'
import { useDepartments } from '@/shared/queries/useDepartment'
import { useJobTitles } from '@/shared/queries/useJobTitle'
import lodash from 'lodash'
import { useCreateUser } from '@/shared/queries/useUser'

export const userModalInputClassNames: InputProps['classNames'] = {
    base: 'grid grid-cols-[140px_1fr] gap-3',
    inputWrapper:
        'w-full border-[1px] bg-background shadow-none !placeholder:italic',
    label: 'text-right font-medium text-base',
}

type Props = {
    isOpen: boolean
    onClose: () => void
}
export default function CreateUserModal({ isOpen, onClose }: Props) {
    const { mutateAsync: createUserMutation, isPending: isCreatingUser } =
        useCreateUser()
    const { departments, isLoading: loadingDepartments } = useDepartments()
    const { jobTitles, isLoading: loadingJobTitles } = useJobTitles()
    const roleList = Object.entries(RoleEnum).map((i) => {
        return {
            ...i,
            label: capitalize(i[1].toLowerCase().replaceAll('_', ' ')),
            value: i[0],
        }
    })

    useKeyboardShortcuts([
        {
            keys: ['escape'],
            onEvent: () => onClose(),
        },
    ])

    const formik = useFormik<CreateUserInput>({
        initialValues: {
            displayName: '',
            avatar: '',
            email: '',
            jobTitleIds: [],
            departmentId: '',
            phoneNumber: '',
            role: 'USER',
        },
        validationSchema: CreateUserSchema,
        onSubmit: async (values) => {
            if (!lodash.isEmpty(formik.errors)) {
                console.log(formik.errors)
                addToast({
                    title: 'Đã xảy ra lỗi',
                    color: 'danger',
                })
            }
            try {
                await createUserMutation(values)
                addToast({
                    title: 'Create user successfully!',
                    color: 'success',
                })
            } catch (error) {
                addToast({
                    title: 'Create user failed!',
                    description: `${error}`,
                    color: 'danger',
                })
            }
        },
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <Modal
                open={isOpen}
                onCancel={onClose}
                title={<p className="text-lg">Create a new User</p>}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '50%',
                }}
                style={{ top: 50 }}
                classNames={{
                    mask: 'backdrop-blur-sm',
                }}
                footer={() => {
                    return (
                        <div className="flex items-center justify-end gap-4">
                            <Button
                                variant="light"
                                color="primary"
                                className="px-14"
                                onPress={() => {
                                    onClose()
                                    formik.resetForm()
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                isLoading={isCreatingUser}
                                color="primary"
                                className="px-16"
                                onPress={() => {
                                    formik.handleSubmit()
                                }}
                                type="submit"
                            >
                                Create
                            </Button>
                        </div>
                    )
                }}
            >
                <div className="py-8 space-y-4 border-t border-border">
                    <HeroInput
                        isRequired
                        id="displayName"
                        name="displayName"
                        label="Display Name"
                        placeholder="e.g. Cao Hai Duong"
                        color="primary"
                        variant="faded"
                        value={formik.values.displayName}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={userModalInputClassNames}
                        isInvalid={
                            Boolean(formik.touched.displayName) &&
                            Boolean(formik.errors.displayName)
                        }
                        errorMessage={
                            Boolean(formik.touched.displayName) &&
                            formik.errors.displayName
                        }
                        size="lg"
                    />
                    <HeroInput
                        isRequired
                        id="email"
                        name="email"
                        label="Email"
                        placeholder="e.g. example@cadsquad.vn"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        color="primary"
                        variant="faded"
                        classNames={userModalInputClassNames}
                        isInvalid={
                            Boolean(formik.touched.email) &&
                            Boolean(formik.errors.email)
                        }
                        errorMessage={
                            Boolean(formik.touched.email) && formik.errors.email
                        }
                        size="lg"
                    />
                    <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
                        <p
                            className={`text-right font-semibold text-base pr-2 ${
                                (Boolean(formik.touched.departmentId) &&
                                    formik.errors.departmentId) ||
                                (Boolean(formik.touched.jobTitleIds) &&
                                    formik.errors.jobTitleIds)
                                    ? 'text-danger'
                                    : 'text-primary'
                            }`}
                        >
                            Position Details
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <HeroSelect
                                isLoading={loadingDepartments}
                                id="departmentId"
                                name="departmentId"
                                label="Department"
                                placeholder="Select one department"
                                size="sm"
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
                                {departments?.map((department) => (
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
                            <HeroSelect
                                isLoading={loadingJobTitles}
                                id="jobTitleIds"
                                name="jobTitleIds"
                                label="Job Titles"
                                placeholder="Select one or more job titles"
                                size="sm"
                                selectionMode="multiple"
                                selectedKeys={formik.values.jobTitleIds}
                                onChange={(e) => {
                                    const value = e.target.value
                                    const valueArr = value
                                        .split(',')
                                        .filter((i) => i !== '')

                                    formik.setFieldValue(
                                        'jobTitleIds',
                                        valueArr
                                    )
                                    formik.setFieldTouched(
                                        'jobTitleIds',
                                        true,
                                        false
                                    )
                                }}
                            >
                                {jobTitles?.map((jTitle) => (
                                    <HeroSelectItem key={jTitle.id}>
                                        {jTitle.displayName}
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-[140px_1fr] gap-3 items-center">
                        <p
                            className={`relative text-right font-semibold text-base pr-2 ${
                                Boolean(formik.touched.role) &&
                                formik.errors.role
                                    ? 'text-danger'
                                    : 'text-primary'
                            }`}
                        >
                            Select Role
                        </p>
                        <div className="flex flex-col w-full">
                            <HeroSelect
                                id="role"
                                name="role"
                                placeholder="Select role permission for this user"
                                size="md"
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
                            {Boolean(formik.touched.role) &&
                                Boolean(formik.errors.role) && (
                                    <p className="mt-1 text-xs text-danger">
                                        {formik.errors.role}
                                    </p>
                                )}
                        </div>
                    </div>
                </div>
            </Modal>
        </form>
    )
}
