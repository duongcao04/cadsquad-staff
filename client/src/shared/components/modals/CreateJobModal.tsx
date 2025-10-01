'use client'

import React, { useMemo, useState } from 'react'

import { Button, Input, InputProps, NumberInput, addToast } from '@heroui/react'
import { Image, Modal, Select } from 'antd'
import { useFormik } from 'formik'

import { useUsers } from '@/shared/queries/useUser'
import { usePaymentChannels } from '@/shared/queries/usePaymentChannel'
import {
    CreateJobInput,
    CreateJobSchema,
} from '@/shared/validationSchemas/job.schema'
import InsertAttachments from '@/app/(routes)/[locale]/(dashboard)/_components/formFields/InsertAttachments'
import InsertJobNo from '@/app/(routes)/[locale]/(dashboard)/_components/formFields/InsertJobNo'
import { useKeyboardShortcuts } from 'use-keyboard-shortcuts'
import useAuth from '@/shared/queries/useAuth'
import { useJobStore } from '@/app/(routes)/[locale]/(dashboard)/onboarding/store/useJobStore'
import { useCreateJobMutation } from '@/shared/queries/useJob'
import InsertDatePicker from '@/app/(routes)/[locale]/(dashboard)/_components/formFields/InsertDatePicker'

export const jobModalInputClassNames: InputProps['classNames'] = {
    base: 'grid grid-cols-[140px_1fr] gap-3',
    inputWrapper:
        'w-full border-[1px] bg-background shadow-none !placeholder:italic',
    label: 'text-right font-medium text-base',
}

type Props = {
    isOpen: boolean
    onClose: () => void
}
export default function CreateJobModal({ isOpen, onClose }: Props) {
    useKeyboardShortcuts([
        {
            keys: ['escape'],
            onEvent: () => onClose(),
        },
    ])

    const { setNewJobNo } = useJobStore()
    const { profile } = useAuth()
    const [isLoading, setLoading] = useState(false)

    /**
     * Get initial data
     */
    const { data: users, isLoading: loadingUsers } = useUsers()
    const { data: paymentChannels, isLoading: loadingPaymentChannels } =
        usePaymentChannels()

    const { mutateAsync: createJobMutation } = useCreateJobMutation()

    const initialValues = useMemo<CreateJobInput>(
        () => ({
            clientName: '',
            typeId: '',
            no: '',
            displayName: '',
            attachmentUrls: [],
            startedAt: new Date(),
            dueAt: new Date(),
            assigneeIds: [],
            incomeCost: null as unknown as number,
            staffCost: null as unknown as number,
            paymentChannelId: null as unknown as string,
            createdById: profile?.id ?? '',
        }),
        [profile?.id]
    )

    const formik = useFormik<CreateJobInput>({
        initialValues,
        validationSchema: CreateJobSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true)

                onClose()
                await createJobMutation({
                    ...values,
                })
                setNewJobNo(values.no)

                addToast({
                    title: 'Create project successfully!',
                    color: 'success',
                })
                formik.resetForm()
            } catch (error) {
                addToast({
                    title: 'Create project failed!',
                    description: `${JSON.stringify(error)}`,
                    color: 'danger',
                })
            } finally {
                setLoading(false)
            }
        },
    })
    console.log(formik.values)

    return (
        <form onSubmit={formik.handleSubmit}>
            <Modal
                open={isOpen}
                onCancel={onClose}
                title={
                    <p className="text-xl font-semibold">Create a new Job</p>
                }
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '50%',
                }}
                style={{ top: 50 }}
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
                                isLoading={isLoading}
                                color="primary"
                                className="px-16"
                                onPress={() => {
                                    formik.handleSubmit()
                                }}
                            >
                                Create Job
                            </Button>
                        </div>
                    )
                }}
            >
                <div className="py-8 space-y-5 border-t border-border">
                    <InsertJobNo formik={formik} />
                    <Input
                        isRequired
                        id="displayName"
                        name="displayName"
                        label="Job name"
                        placeholder="e.g. 3D Modeling"
                        color="primary"
                        variant="faded"
                        value={formik.values.displayName}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            ...jobModalInputClassNames,
                        }}
                        isInvalid={
                            Boolean(formik.touched.displayName) &&
                            Boolean(formik.errors.displayName)
                        }
                        errorMessage={
                            Boolean(formik.touched.displayName) &&
                            formik.errors.displayName
                        }
                        size="md"
                    />
                    <Input
                        isRequired
                        id="clientName"
                        name="clientName"
                        label="Client name"
                        placeholder="e.g. Tom Jain"
                        color="primary"
                        variant="faded"
                        value={formik.values.clientName}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            ...jobModalInputClassNames,
                        }}
                        isInvalid={
                            Boolean(formik.touched.clientName) &&
                            Boolean(formik.errors.clientName)
                        }
                        errorMessage={
                            Boolean(formik.touched.clientName) &&
                            formik.errors.clientName
                        }
                        size="md"
                    />

                    <NumberInput
                        isRequired
                        id="incomeCost"
                        name="incomeCost"
                        label="Income"
                        placeholder="0"
                        color="primary"
                        variant="faded"
                        type="number"
                        maxValue={999999999999999}
                        value={formik.values.incomeCost}
                        onChange={(value) =>
                            formik.setFieldValue('incomeCost', Number(value))
                        }
                        startContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small px-0.5">
                                    $
                                </span>
                            </div>
                        }
                        labelPlacement="outside-left"
                        classNames={{
                            ...jobModalInputClassNames,
                        }}
                        isInvalid={
                            Boolean(formik.touched.incomeCost) &&
                            Boolean(formik.errors.incomeCost)
                        }
                        errorMessage={
                            Boolean(formik.touched.incomeCost) &&
                            formik.errors.incomeCost
                        }
                        size="md"
                    />
                    <NumberInput
                        isRequired
                        id="staffCost"
                        name="staffCost"
                        label="Staff cost"
                        placeholder="0"
                        color="primary"
                        variant="faded"
                        type="number"
                        maxValue={999999999999999}
                        value={formik.values.staffCost}
                        onChange={(value) =>
                            formik.setFieldValue('staffCost', Number(value))
                        }
                        startContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small px-0.5">
                                    đ
                                </span>
                            </div>
                        }
                        labelPlacement="outside-left"
                        classNames={{
                            ...jobModalInputClassNames,
                        }}
                        isInvalid={
                            Boolean(formik.touched.staffCost) &&
                            Boolean(formik.errors.staffCost)
                        }
                        errorMessage={
                            Boolean(formik.touched.staffCost) &&
                            formik.errors.staffCost
                        }
                        size="md"
                    />
                    <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
                        <p
                            className={`relative text-right font-medium text-base pr-2 ${
                                Boolean(formik.touched.dueAt) &&
                                formik.errors.dueAt
                                    ? 'text-danger'
                                    : 'text-primary'
                            }`}
                        >
                            Delivery date
                            <span className="absolute top-0 right-0 text-danger!">
                                *
                            </span>
                        </p>
                        <div className="flex flex-col w-full">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InsertDatePicker
                                        label="Start at"
                                        onChange={(value) => {
                                            formik.setFieldValue(
                                                'startedAt',
                                                value.toDate('Asia/Ho_Chi_Minh')
                                            )
                                        }}
                                    />
                                    {Boolean(formik.touched.startedAt) &&
                                        Boolean(formik.errors.startedAt) && (
                                            <p className="mt-1 text-xs text-danger">
                                                {formik.errors.startedAt}
                                            </p>
                                        )}
                                </div>
                                <div>
                                    <InsertDatePicker
                                        label="Due at"
                                        onChange={(value) => {
                                            formik.setFieldValue(
                                                'dueAt',
                                                value.toDate('Asia/Ho_Chi_Minh')
                                            )
                                        }}
                                    />
                                    {Boolean(formik.touched.dueAt) &&
                                        Boolean(formik.errors.dueAt) && (
                                            <p className="mt-1 text-xs text-danger">
                                                {formik.errors.dueAt}
                                            </p>
                                        )}
                                </div>
                            </div>
                            {Boolean(formik.touched.dueAt) &&
                                Boolean(formik.errors.dueAt) && (
                                    <p className="mt-1 text-xs text-danger">
                                        {/* {formik.errors.dueAt} */}
                                    </p>
                                )}
                        </div>
                    </div>
                    <hr className="w-[30%] mx-auto mt-1 pb-1 opacity-20" />
                    <div className="w-full grid grid-cols-[140px_1fr] gap-3 items-start">
                        <p
                            className={`pt-1.5 text-right font-medium text-base ${
                                Boolean(formik.touched.attachmentUrls) &&
                                formik.errors.attachmentUrls
                                    ? 'text-danger'
                                    : 'text-primary'
                            }`}
                        >
                            Attachments
                        </p>
                        <div className="flex flex-col w-full">
                            <InsertAttachments formik={formik} />
                            {Boolean(formik.touched.attachmentUrls) &&
                                Boolean(formik.errors.attachmentUrls) && (
                                    <p className="mt-1 text-xs text-danger">
                                        {formik.errors.attachmentUrls}
                                    </p>
                                )}
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-[140px_1fr] gap-3 items-center">
                        <p
                            className={`text-right font-medium text-base ${
                                Boolean(formik.touched.assigneeIds) &&
                                formik.errors.assigneeIds
                                    ? 'text-danger'
                                    : 'text-primary'
                            }`}
                        >
                            Member assign
                        </p>
                        <div className="flex flex-col w-full">
                            <Select
                                loading={loadingUsers}
                                options={users?.map((usr) => {
                                    return {
                                        ...usr,
                                        label: usr?.displayName,
                                        value: usr?.id,
                                    }
                                })}
                                placeholder="Select one or more member"
                                size="middle"
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
                                                    src={
                                                        opt.data.avatar ??
                                                        'https://avatar.iran.liara.run/public/boy?username=cadsquad'
                                                    }
                                                    alt={opt.data.displayName}
                                                    className="size-full rounded-full object-cover"
                                                    preview={false}
                                                />
                                            </div>
                                            <p className="font-normal">
                                                {opt.data.displayName}
                                            </p>
                                        </div>
                                    )
                                }}
                                styles={{}}
                                mode="multiple"
                                onChange={(value) => {
                                    formik.setFieldValue('assigneeIds', value)
                                }}
                                value={formik.values.assigneeIds}
                            />
                            {Boolean(formik.touched.assigneeIds) &&
                                Boolean(formik.errors.assigneeIds) && (
                                    <p className="mt-1 text-xs text-danger">
                                        {formik.errors.assigneeIds}
                                    </p>
                                )}
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-[140px_1fr] gap-3 items-center">
                        <p
                            className={`text-right font-medium text-base ${
                                Boolean(formik.touched.assigneeIds) &&
                                formik.errors.assigneeIds
                                    ? 'text-danger'
                                    : 'text-primary'
                            }`}
                        >
                            Payment channel
                        </p>
                        <div className="flex flex-col w-full">
                            <Select
                                loading={loadingPaymentChannels}
                                options={paymentChannels?.map((channel) => {
                                    return {
                                        ...channel,
                                        label: channel?.displayName,
                                        value: channel?.id?.toString(),
                                    }
                                })}
                                placeholder="Select one Payment channel"
                                size="middle"
                                onChange={(value) => {
                                    formik.setFieldValue(
                                        'paymentChannelId',
                                        value
                                    )
                                }}
                                value={formik.values.paymentChannelId}
                            />
                            {Boolean(formik.touched.paymentChannelId) &&
                                Boolean(formik.errors.paymentChannelId) && (
                                    <p className="mt-1 text-xs text-danger">
                                        {formik.errors.paymentChannelId}
                                    </p>
                                )}
                        </div>
                    </div>
                </div>
            </Modal>
        </form>
    )
}
