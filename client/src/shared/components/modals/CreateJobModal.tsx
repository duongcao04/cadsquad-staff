'use client'

import React, { useState } from 'react'

import { Button, Input, InputProps, NumberInput, addToast } from '@heroui/react'
import { Image, Modal, Select } from 'antd'
import { useFormik } from 'formik'
import { useKeyboardShortcuts } from 'use-keyboard-shortcuts'

import { padToFourDigits } from '@/lib/utils'
import { useAuthStore } from '@/lib/zustand/useAuthStore'

import { useJobStore } from '@/app/(routes)/[locale]/(dashboard)/onboarding/store/useJobStore'
import DateTimePicker from '@/app/(routes)/[locale]/(dashboard)/_components/form-fields/DateTimePicker'
import { useJobTypes } from '@/shared/queries/useJobType'
import { useUsers } from '@/shared/queries/useUser'
import { usePaymentChannels } from '@/shared/queries/usePaymentChannel'
import { useJobStatuses } from '@/shared/queries/useJobStatus'
import { useCreateJobMutation } from '@/shared/queries/useJob'
import {
    CreateJobInput,
    CreateJobSchema,
} from '@/shared/validationSchemas/job.schema'

const pareJobNo = (jobTypeCode: string, jobNumber: number) => {
    return jobTypeCode + '.' + padToFourDigits(jobNumber)
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

    const { authUser } = useAuthStore()
    const [isLoading, setLoading] = useState(false)
    const { setNewJobNo } = useJobStore()

    const { mutateAsync: createJobMutate, isIdle: isCreatingJob } =
        useCreateJobMutation()

    /**
     * Get initial data
     */
    const { data: users, isLoading: loadingUsers } = useUsers()
    const { data: jobTypes, isLoading: loadingJobTypes } = useJobTypes()
    const { data: paymentChannels, isLoading: loadingPaymentChannels } =
        usePaymentChannels()
    const { data: jobStatuses } = useJobStatuses()

    // const getJobNo = useMemo(() => {
    //     if (!loadingJobTypes && jobTypes) {
    //         const jobNumber = jobTypes[0 + 1
    //         return jobNumber.toString().padStart(4, '0')
    //     }
    //     return ''
    // }, [jobTypes, loadingJobTypes])

    const formik = useFormik<CreateJobInput>({
        initialValues: {
            clientName: '',
            typeId: jobTypes?.[0].id,
            no: '',
            displayName: '',
            sourceUrl: '',
            startedAt: new Date(),
            dueAt: new Date(),
            assigneeIds: [],
            incomeCost: null as unknown as number,
            staffCost: null as unknown as number,
            paymentChannelId: null as unknown as string,
            createdById: authUser?.id ?? '', // Add createdById from authUser
            statusId: jobStatuses?.[0]?.id ?? '', // Add statusId from jobStatuses
        },
        validationSchema: CreateJobSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                setLoading(true)

                // const jobType = jobTypes!.find(
                //     (jType) => jType.id!.toString() === values.jobTypeId
                // )
                // const jobNumber = jobType!._count.jobs + 1
                const newJob = {
                    ...values,
                    // jobNo: pareJobNo(jobType!.code!, jobNumber),
                }

                await createJobMutate(newJob)

                onClose()
                // setNewJobNo(newJob.jobNo)
                formik.resetForm()
                addToast({
                    title: 'Create project successfully!',
                    color: 'success',
                })
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

    const inputClassNames: InputProps['classNames'] = {
        inputWrapper:
            'w-full border-[1px] bg-background shadow-none !placeholder:italic',
        label: 'text-right font-medium text-base',
    }

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
                style={{ top: 80 }}
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
                    <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
                        <p
                            className={`relative text-right font-medium text-base pr-2 ${
                                Boolean(formik.touched.dueAt) &&
                                formik.errors.dueAt
                                    ? 'text-danger'
                                    : 'text-primary'
                            }`}
                        >
                            No.
                            <span className="absolute top-0 right-0 text-danger!">
                                *
                            </span>
                        </p>
                        <div className="grid grid-cols-[0.2fr_5px_1fr] gap-3 items-center">
                            <Select
                                options={jobTypes?.map((jType) => {
                                    return {
                                        ...jType,
                                        label: jType.code!,
                                        value: jType.id!.toString(),
                                    }
                                })}
                                placeholder="Select Job Type first"
                                size="middle"
                                onChange={(value) => {
                                    formik.setFieldValue('jobTypeId', value)
                                }}
                                value={formik.values.typeId}
                            />
                            <hr />
                            <Input
                                isRequired
                                id="no"
                                name="no"
                                placeholder="e.g. 0001"
                                value={formik.values.no}
                                onChange={formik.handleChange}
                                color="primary"
                                variant="faded"
                                classNames={inputClassNames}
                                isDisabled
                                isInvalid={
                                    Boolean(formik.touched.no) &&
                                    Boolean(formik.errors.no)
                                }
                                errorMessage={
                                    Boolean(formik.touched.no) &&
                                    formik.errors.no
                                }
                                size="md"
                            />
                        </div>
                    </div>
                    <Input
                        isRequired
                        id="clientName"
                        name="clientName"
                        label="Client Name"
                        placeholder="e.g. Tom Jain"
                        color="primary"
                        variant="faded"
                        value={formik.values.clientName}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            base: 'grid grid-cols-[140px_1fr] gap-3',
                            ...inputClassNames,
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
                    <Input
                        isRequired
                        id="displayName"
                        name="displayName"
                        label="Job Name"
                        placeholder="e.g. 3D Modeling"
                        color="primary"
                        variant="faded"
                        value={formik.values.displayName}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            base: 'grid grid-cols-[140px_1fr] gap-3',
                            ...inputClassNames,
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
                            base: 'grid grid-cols-[140px_1fr] gap-3',
                            ...inputClassNames,
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
                        label="Staff Cost"
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
                            base: 'grid grid-cols-[140px_1fr] gap-3',
                            ...inputClassNames,
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
                            Delivery Date
                            <span className="absolute top-0 right-0 text-danger!">
                                *
                            </span>
                        </p>
                        <div className="flex flex-col w-full">
                            {/* <DateTimePicker form={formik} /> */}
                            {Boolean(formik.touched.dueAt) &&
                                Boolean(formik.errors.dueAt) && (
                                    <p className="mt-1 text-xs text-danger">
                                        {formik.errors.dueAt}
                                    </p>
                                )}
                        </div>
                    </div>
                    <hr className="w-[30%] mx-auto mt-1 pb-1 opacity-20" />

                    <Input
                        id="sourceUrl"
                        name="sourceUrl"
                        label="Link"
                        placeholder="e.g. http://example.com/"
                        color="primary"
                        variant="faded"
                        value={formik.values.sourceUrl}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            base: 'grid grid-cols-[140px_1fr] gap-3',
                            ...inputClassNames,
                        }}
                        isInvalid={
                            Boolean(formik.touched.sourceUrl) &&
                            Boolean(formik.errors.sourceUrl)
                        }
                        errorMessage={
                            Boolean(formik.touched.sourceUrl) &&
                            formik.errors.sourceUrl
                        }
                        size="md"
                    />
                    <div className="w-full grid grid-cols-[140px_1fr] gap-3 items-center">
                        <p
                            className={`text-right font-medium text-base ${
                                Boolean(formik.touched.assigneeIds) &&
                                formik.errors.assigneeIds
                                    ? 'text-danger'
                                    : 'text-primary'
                            }`}
                        >
                            Member Assign
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
                            Payment Channel
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
