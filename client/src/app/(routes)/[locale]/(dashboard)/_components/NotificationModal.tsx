'use client'

import React, { useState } from 'react'

import { Button, Input, Textarea, addToast } from '@heroui/react'
import { Image, Modal, Select } from 'antd'
import { useFormik } from 'formik'
import { useKeyboardShortcuts } from 'use-keyboard-shortcuts'

import {
    CreateNotificationSchema,
    NewNotification,
} from '@/validationSchemas/notification.schema'
import { useUsers } from '@/shared/queries/useUser'
import { useSendNotiMutation } from '@/shared/queries/useNotification'

type Props = {
    isOpen: boolean
    onClose: () => void
}
export default function NotificationModal({ isOpen, onClose }: Props) {
    useKeyboardShortcuts([
        {
            keys: ['escape'],
            onEvent: () => onClose(),
        },
    ])

    const [isLoading, setLoading] = useState(false)
    const { data: users } = useUsers()
    const { mutateAsync: sendNotiMutate, isIdle: isSendingNoti } =
        useSendNotiMutation()

    const formik = useFormik<NewNotification>({
        initialValues: {
            content: '',
            recipientId: null as unknown as string,
            title: '',
            image: null,
        },
        validationSchema: CreateNotificationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true)

                await sendNotiMutate(values)
                addToast({
                    title: 'Gửi thông báo thành công!',
                    color: 'success',
                })
            } catch (error) {
                addToast({
                    title: 'Gửi thông báo thất bại!',
                    description: `${error}`,
                    color: 'danger',
                })
            } finally {
                setLoading(false)
            }
        },
    })

    console.log(formik.errors)

    return (
        <form onSubmit={formik.handleSubmit}>
            <Modal
                open={isOpen}
                onCancel={onClose}
                title={<p className="text-lg capitalize">Send notification</p>}
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
                        id="title"
                        name="title"
                        label="Subject"
                        placeholder="e.g. Sample notification for sample issue"
                        color="secondary"
                        variant="faded"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
                            inputWrapper: 'w-full',
                            label: 'text-right font-medium text-base',
                        }}
                        isInvalid={
                            Boolean(formik.touched.title) &&
                            Boolean(formik.errors.title)
                        }
                        errorMessage={
                            Boolean(formik.touched.title) && formik.errors.title
                        }
                        size="lg"
                    />

                    <div className="w-full grid grid-cols-[0.25fr_1fr] gap-3 items-center">
                        <p
                            className={`relative text-right font-medium text-base pr-2 ${
                                Boolean(formik.touched.recipientId) &&
                                formik.errors.recipientId
                                    ? 'text-danger'
                                    : 'text-secondary'
                            }`}
                        >
                            Receiver
                            <span className="absolute top-0 right-0 text-danger!">
                                *
                            </span>
                        </p>
                        <div className="flex flex-col w-full">
                            <Select
                                options={users?.map((usr) => {
                                    return {
                                        ...usr,
                                        label: usr?.name,
                                        value: usr?.id,
                                    }
                                })}
                                placeholder="Select receiver"
                                size="large"
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                optionRender={(opt) => {
                                    return (
                                        <div className="flex items-center justify-start gap-4">
                                            <div className="size-9">
                                                <Image
                                                    src={opt.data.avatar ?? ''}
                                                    alt={opt.data.name}
                                                    className="size-full rounded-full object-cover"
                                                    preview={false}
                                                />
                                            </div>
                                            <p className="font-normal">
                                                {opt.data.name}
                                            </p>
                                        </div>
                                    )
                                }}
                                styles={{}}
                                onChange={(value) => {
                                    formik.setFieldValue('recipientId', value)
                                }}
                                value={formik.values.recipientId}
                            />
                            {Boolean(formik.touched.recipientId) &&
                                Boolean(formik.errors.recipientId) && (
                                    <p className="mt-1 text-xs text-danger">
                                        {formik.errors.recipientId}
                                    </p>
                                )}
                        </div>
                    </div>

                    <Textarea
                        isRequired
                        id="content"
                        name="content"
                        label="Message"
                        placeholder="Enter message here ..."
                        color="secondary"
                        variant="faded"
                        value={formik.values.content}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
                            inputWrapper: 'w-full',
                            label: 'text-right font-medium text-base',
                        }}
                        isInvalid={
                            Boolean(formik.touched.content) &&
                            Boolean(formik.errors.content)
                        }
                        errorMessage={
                            Boolean(formik.touched.content) &&
                            formik.errors.content
                        }
                        size="lg"
                    />
                </div>
            </Modal>
        </form>
    )
}
