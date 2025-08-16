'use client'

import React, { useMemo, useState } from 'react'

import { Button, Input, InputProps, NumberInput, addToast } from '@heroui/react'
import { Image, Modal, Select } from 'antd'
import { useFormik } from 'formik'
import useSWR from 'swr'
import { useKeyboardShortcuts } from 'use-keyboard-shortcuts'

import { useCreateMutation } from '@/lib/swr/actions'
import { getProjects } from '@/lib/swr/actions/project'
import { padToFourDigits } from '@/lib/utils'
import { useAuthStore } from '@/lib/zustand/useAuthStore'
import { NewNotification } from '@/validationSchemas/notification.schema'
import { CreateJobSchema, NewJob } from '@/validationSchemas/job.schema'

import { useJobStore } from '../onboarding/store/useJobStore'
import DateTimePicker from './form-fields/DateTimePicker'
import { useJobTypes } from '@/queries/useJobType'
import { useUsers } from '@/queries/useUser'
import { usePaymentChannels } from '@/queries/usePaymentChannel'
import { useJobStatuses } from '@/queries/useJobStatus'
import { SEND_NOTIFICATION_API } from '../../../../lib/swr/api'
import { useCreateJobMutation } from '../../../../queries/useJob'

const DOT_SYMBOL = '.'

const pareJobNo = (jobTypeCode: string, jobNumber: number) => {
    return jobTypeCode + DOT_SYMBOL + padToFourDigits(jobNumber)
}

type Props = {
    isOpen: boolean
    onClose: () => void
}
export default function JobModal({ isOpen, onClose }: Props) {
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
    const { trigger: createNotification } = useCreateMutation<NewNotification>(
        SEND_NOTIFICATION_API
    )

    /**
     * Get initial data
     */
    const { data: users, isLoading: loadingUsers } = useUsers()
    const { data: jobTypes, isLoading: loadingJobTypes } = useJobTypes()
    const { data: paymentChannels, isLoading: loadingPaymentChannels } =
        usePaymentChannels()
    const { data: jobStatuses } = useJobStatuses()

    /**
     * Default value with API response
     */
    const defaultJobTypeId = useMemo(() => {
        if (!loadingJobTypes && jobTypes) {
            return jobTypes[0]?.id?.toString() as string
        }
        return ''
    }, [jobTypes, loadingJobTypes])

    const getJobNo = useMemo(() => {
        if (!loadingJobTypes && jobTypes) {
            const jobNumber = jobTypes[0]?._count.jobs + 1
            return jobNumber.toString().padStart(4, '0')
        }
        return ''
    }, [jobTypes, loadingJobTypes])

    const formik = useFormik<NewJob>({
        initialValues: {
            createdById: authUser?.id ?? '',
            clientName: '',
            jobTypeId: defaultJobTypeId,
            jobNo: getJobNo,
            jobName: '',
            sourceUrl: '',
            startedAt: '',
            dueAt: '',
            memberAssignIds: [],
            income: null as unknown as number,
            staffCost: null as unknown as number,
            paymentChannelId: null as unknown as string,
        },
        validationSchema: CreateJobSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                setLoading(true)

                const jobType = jobTypes!.find(
                    (jType) => jType.id!.toString() === values.jobTypeId
                )
                const jobNumber = jobType!._count.jobs + 1
                const newJob = {
                    ...values,
                    jobNo: pareJobNo(jobType!.code!, jobNumber),
                }

                values.memberAssignIds.forEach(async (recipientId) => {
                    const newNotification: NewNotification = {
                        recipientId,
                        title: 'New job assigned!',
                        content: `Job No. ${newJob.jobNo} have just been assigned from ${authUser?.name}. View here`,
                        image: jobStatuses?.[0].thumbnail ?? null,
                    }
                    await createNotification(newNotification)
                })

                onClose()
                setNewJobNo(newJob.jobNo)
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
            'w-full border-[1px] bg-[hsl(0,0%,96%)] shadow-xs !placeholder:italic',
        label: 'text-right font-medium text-base',
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <Modal
                open={isOpen}
                onCancel={onClose}
                title={
                    <p className="text-xl font-semibold capitalize">
                        Create Job
                    </p>
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
                styles={{
                    mask: {
                        background: '#000000b7',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)', // for Safari support
                    },
                    content: {
                        borderRadius: '24px',
                    },
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
                <div className="py-8 space-y-4 border-t border-border">
                    <div className="grid grid-cols-[0.25fr_1fr] gap-3 items-center">
                        <p
                            className={`relative text-right font-medium text-base pr-2 ${
                                Boolean(formik.touched.dueAt) &&
                                formik.errors.dueAt
                                    ? 'text-danger'
                                    : 'text-primary'
                            }`}
                        >
                            Job No.
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
                                size="large"
                                onChange={(value) => {
                                    const findJobType = jobTypes?.find(
                                        (item) => item.id?.toString() === value
                                    )
                                    formik.setFieldValue('jobTypeId', value)
                                    formik.setFieldValue(
                                        'jobNo',
                                        padToFourDigits(
                                            (findJobType?._count.jobs ?? 0) + 1
                                        )
                                    )
                                }}
                                value={formik.values.jobTypeId}
                            />
                            <hr />
                            <Input
                                isRequired
                                id="jobNo"
                                name="jobNo"
                                placeholder="e.g. 0001"
                                value={formik.values.jobNo}
                                onChange={formik.handleChange}
                                color="primary"
                                variant="faded"
                                classNames={inputClassNames}
                                isDisabled
                                isInvalid={
                                    Boolean(formik.touched.jobNo) &&
                                    Boolean(formik.errors.jobNo)
                                }
                                errorMessage={
                                    Boolean(formik.touched.jobNo) &&
                                    formik.errors.jobNo
                                }
                                size="lg"
                            />
                        </div>
                    </div>
                    <Input
                        isRequired
                        id="clientName"
                        name="clientName"
                        label="Client"
                        placeholder="e.g. Tom Jain"
                        color="primary"
                        variant="faded"
                        value={formik.values.clientName}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
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
                        size="lg"
                    />
                    <Input
                        isRequired
                        id="jobName"
                        name="jobName"
                        label="Job Name"
                        placeholder="e.g. 3D Modeling"
                        color="primary"
                        variant="faded"
                        value={formik.values.jobName}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
                            ...inputClassNames,
                        }}
                        isInvalid={
                            Boolean(formik.touched.jobName) &&
                            Boolean(formik.errors.jobName)
                        }
                        errorMessage={
                            Boolean(formik.touched.jobName) &&
                            formik.errors.jobName
                        }
                        size="lg"
                    />
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
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
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
                        size="lg"
                    />
                    <div className="w-full grid grid-cols-[0.25fr_1fr] gap-3 items-center">
                        <p
                            className={`relative text-right font-medium text-base pr-2 ${
                                Boolean(formik.touched.memberAssignIds) &&
                                formik.errors.memberAssignIds
                                    ? 'text-danger'
                                    : 'text-primary'
                            }`}
                        >
                            Member Assign
                            <span className="absolute top-0 right-0 text-danger!">
                                *
                            </span>
                        </p>
                        <div className="flex flex-col w-full">
                            <Select
                                loading={loadingUsers}
                                options={users?.map((usr) => {
                                    return {
                                        ...usr,
                                        label: usr?.name,
                                        value: usr?.id,
                                    }
                                })}
                                placeholder="Select one or more member"
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
                                                    src={
                                                        opt.data.avatar ??
                                                        'https://avatar.iran.liara.run/public/boy?username=cadsquad'
                                                    }
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
                                mode="multiple"
                                onChange={(value) => {
                                    formik.setFieldValue(
                                        'memberAssignIds',
                                        value
                                    )
                                }}
                                value={formik.values.memberAssignIds}
                            />
                            {Boolean(formik.touched.memberAssignIds) &&
                                Boolean(formik.errors.memberAssignIds) && (
                                    <p className="mt-1 text-xs text-danger">
                                        {formik.errors.memberAssignIds}
                                    </p>
                                )}
                        </div>
                    </div>
                    <div className="grid grid-cols-[0.25fr_1fr] gap-3 items-center">
                        <p
                            className={`relative text-right font-medium text-base pr-2 ${
                                Boolean(formik.touched.dueAt) &&
                                formik.errors.dueAt
                                    ? 'text-danger'
                                    : 'text-primary'
                            }`}
                        >
                            Delivery
                            <span className="absolute top-0 right-0 text-danger!">
                                *
                            </span>
                        </p>
                        <div className="flex flex-col w-full">
                            <DateTimePicker form={formik} />
                            {Boolean(formik.touched.dueAt) &&
                                Boolean(formik.errors.dueAt) && (
                                    <p className="mt-1 text-xs text-danger">
                                        {formik.errors.dueAt}
                                    </p>
                                )}
                        </div>
                    </div>
                    <hr className="w-[30%] mx-auto mt-1 pb-1 opacity-20" />
                    <NumberInput
                        isRequired
                        id="income"
                        name="income"
                        label="Income"
                        placeholder="0"
                        color="primary"
                        variant="faded"
                        type="number"
                        maxValue={999999999999999}
                        value={formik.values.income}
                        onChange={(value) =>
                            formik.setFieldValue('income', Number(value))
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
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
                            ...inputClassNames,
                        }}
                        isInvalid={
                            Boolean(formik.touched.income) &&
                            Boolean(formik.errors.income)
                        }
                        errorMessage={
                            Boolean(formik.touched.income) &&
                            formik.errors.income
                        }
                        size="lg"
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
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
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
                        size="lg"
                    />
                    <div className="w-full grid grid-cols-[0.25fr_1fr] gap-3 items-center">
                        <p
                            className={`relative text-right font-medium text-base pr-2 ${
                                Boolean(formik.touched.memberAssignIds) &&
                                formik.errors.memberAssignIds
                                    ? 'text-danger'
                                    : 'text-primary'
                            }`}
                        >
                            Payment Channel
                            <span className="absolute top-0 right-0 text-danger!">
                                *
                            </span>
                        </p>
                        <div className="flex flex-col w-full">
                            <Select
                                loading={loadingPaymentChannels}
                                options={paymentChannels?.map((channel) => {
                                    return {
                                        ...channel,
                                        label: channel?.name,
                                        value: channel?.id?.toString(),
                                    }
                                })}
                                placeholder="Select one Payment channel"
                                size="large"
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
