'use client'

import React, { useState } from 'react'

import { Button, Input, addToast } from '@heroui/react'
import { Modal, Select } from 'antd'
import { useFormik } from 'formik'
import { useKeyboardShortcuts } from 'use-keyboard-shortcuts'

import { supabase } from '@/lib/supabase/client'
import { capitalize, removeVietnameseTones } from '@/lib/utils'
import { RoleEnum } from '@/shared/enums/role.enum'
import { CreateUserSchema } from '@/shared/validationSchemas/user.schema'

type Props = {
    isOpen: boolean
    onClose: () => void
}
export default function CreateUserModal({ isOpen, onClose }: Props) {
    const [isLoading, setLoading] = useState(false)

    useKeyboardShortcuts([
        {
            keys: ['escape'],
            onEvent: () => onClose(),
        },
    ])

    const formik = useFormik({
        initialValues: {
            name: '',
            avatar: '',
            email: '',
            jobTitle: '',
            department: '',
            phoneNumber: '',
            role: 'USER',
        },
        validationSchema: CreateUserSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true)

                // // TODO: For test mode
                // // Please fix: Send invation to email -> Email verify and create account after that.
                // // const { data: authData, error } = await supabase.auth.signUp({
                // //     email: values.email,
                // //     password: 'cadsquaddotvn',
                // // })

                // if (error) {
                //     throw new Error(`${error}`)
                // }

                // const newUser = {
                //     ...values,
                //     id: authData.session?.user.id as string,
                //     avatar:
                //         values.avatar!.length === 0
                //             ? `https://ui-avatars.com/api/?name=${removeVietnameseTones(values.name.replaceAll(' ', '+'))}`
                //             : values.avatar,
                // }

                // const res = await fetch('/api/users', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(newUser),
                // })
                // const data = await res.json()

                // if (res.status === 201) {
                //     addToast({
                //         title: 'Create user successfully!',
                //         color: 'success',
                //     })
                // } else {
                //     throw new Error(data)
                // }
            } catch (error) {
                addToast({
                    title: 'Create user failed!',
                    description: `${error}`,
                    color: 'danger',
                })
            } finally {
                setLoading(false)
            }
        },
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <Modal
                open={isOpen}
                onCancel={onClose}
                title={<p className="text-lg capitalize">Create new User</p>}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '50%',
                }}
                classNames={{
                    mask: 'backdrop-blur-sm',
                }}
                footer={() => {
                    return (
                        <div className="flex items-center justify-end gap-4">
                            <Button
                                variant="light"
                                color="secondary"
                                className="px-14"
                                onPress={() => {
                                    onClose()
                                    formik.resetForm()
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                isLoading={isLoading}
                                color="secondary"
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
                    <Input
                        isRequired
                        id="name"
                        name="name"
                        label="Display Name"
                        placeholder="e.g. Cao Hai Duong"
                        color="secondary"
                        variant="faded"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
                            inputWrapper: 'w-full',
                            label: 'text-right font-medium text-base',
                        }}
                        isInvalid={
                            Boolean(formik.touched.name) &&
                            Boolean(formik.errors.name)
                        }
                        errorMessage={
                            Boolean(formik.touched.name) && formik.errors.name
                        }
                        size="lg"
                    />
                    <Input
                        isRequired
                        id="email"
                        name="email"
                        label="Email"
                        placeholder="e.g. example@cadsquad.vn"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        color="secondary"
                        variant="faded"
                        classNames={{
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
                            inputWrapper: 'w-full',
                            label: 'text-right font-medium text-base',
                        }}
                        isInvalid={
                            Boolean(formik.touched.email) &&
                            Boolean(formik.errors.email)
                        }
                        errorMessage={
                            Boolean(formik.touched.email) && formik.errors.email
                        }
                        size="lg"
                    />
                    <div className="grid grid-cols-[0.25fr_1fr] gap-3 items-center">
                        <p
                            className={`relative text-right font-semibold text-base pr-2 ${(Boolean(formik.touched.department) && formik.errors.department) || (Boolean(formik.touched.jobTitle) && formik.errors.jobTitle) ? 'text-danger' : 'text-secondary'}`}
                        >
                            Poisition Details
                            <span className="absolute top-0 right-0 text-danger!">
                                *
                            </span>
                        </p>
                        <div className="flex items-center justify-between gap-4">
                            <Input
                                id="department"
                                name="department"
                                label="Department"
                                color="secondary"
                                variant="faded"
                                value={formik.values.department}
                                onChange={formik.handleChange}
                                classNames={{
                                    inputWrapper: 'w-full',
                                    label: 'text-right font-medium text-base',
                                }}
                                isInvalid={
                                    Boolean(formik.touched.department) &&
                                    Boolean(formik.errors.department)
                                }
                                errorMessage={
                                    Boolean(formik.touched.department) &&
                                    formik.errors.department
                                }
                            />
                            <Input
                                id="jobTitle"
                                name="jobTitle"
                                label="Job Title"
                                color="secondary"
                                variant="faded"
                                value={formik.values.jobTitle}
                                onChange={formik.handleChange}
                                classNames={{
                                    inputWrapper: 'w-full',
                                    label: 'text-right font-medium text-base',
                                }}
                                isInvalid={
                                    Boolean(formik.touched.jobTitle) &&
                                    Boolean(formik.errors.jobTitle)
                                }
                                errorMessage={
                                    Boolean(formik.touched.jobTitle) &&
                                    formik.errors.jobTitle
                                }
                            />
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-[0.25fr_1fr] gap-3 items-center">
                        <p
                            className={`relative text-right font-semibold text-base pr-2 ${Boolean(formik.touched.role) && formik.errors.role ? 'text-danger' : 'text-secondary'}`}
                        >
                            Select Role
                        </p>
                        <div className="flex flex-col w-full">
                            <Select
                                options={Object.entries(RoleEnum).map((i) => {
                                    return {
                                        ...i,
                                        label: capitalize(
                                            i[1]
                                                .toLowerCase()
                                                .replaceAll('_', ' ')
                                        ),
                                        value: i[0],
                                    }
                                })}
                                placeholder="Select one or more member"
                                size="large"
                                optionRender={(opt) => {
                                    return <p>{opt.label}</p>
                                }}
                                onChange={(value) => {
                                    formik.setFieldValue('role', value)
                                }}
                                value={formik.values.role}
                            />
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
