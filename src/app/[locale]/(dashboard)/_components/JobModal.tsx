'use client'

import React, { useMemo, useState } from 'react'

import { Button, Input, NumberInput, addToast } from '@heroui/react'
import { Image, Modal, Select } from 'antd'
import { useFormik } from 'formik'
import useSWR from 'swr'

import { useCreateMutation } from '@/lib/swr/actions'
import { getJobStatuses } from '@/lib/swr/actions/jobStatus'
import { getJobTypes } from '@/lib/swr/actions/jobTypes'
import { getPaymentChannels } from '@/lib/swr/actions/paymentChannels'
import { getUsers } from '@/lib/swr/actions/user'
import {
    JOB_STATUS_API,
    JOB_TYPE_API,
    PAYMENT_CHANNEL_API,
    PROJECT_API,
    USER_API,
} from '@/lib/swr/api'
import { padToFourDigits } from '@/lib/utils'
import { useAuthStore } from '@/lib/zustand/useAuthStore'
import {
    CreateProjectSchema,
    NewProject,
} from '@/validationSchemas/project.schema'

import DateTimePicker from './form-fields/DateTimePicker'

const DOT_SYMBOL = '.'

const pareJobNo = (jobTypeCode: string, jobNumber: number) => {
    return jobTypeCode + DOT_SYMBOL + padToFourDigits(jobNumber)
}

type Props = {
    isOpen: boolean
    onClose: () => void
}
export default function JobModal({ isOpen, onClose }: Props) {
    const { authUser } = useAuthStore()
    const [isLoading, setLoading] = useState(false)

    const { trigger: createProject } =
        useCreateMutation<NewProject>(PROJECT_API)

    /**
     * Fetch data
     */
    const { data: users } = useSWR(USER_API, getUsers)
    const { data: jobTypes, isLoading: loadingJobTypes } = useSWR(
        JOB_TYPE_API,
        getJobTypes
    )
    const { data: paymentChannels } = useSWR(
        PAYMENT_CHANNEL_API,
        getPaymentChannels
    )
    const { data: jobStatuses, isLoading: loadingJobStatuses } = useSWR(
        JOB_STATUS_API,
        getJobStatuses
    )

    const sendNotification = async (recipientId: string) => {
        const newNotification = {
            recipientId,
            title: 'New job assigned',
            content: 'Job No. FV.0551 have just been assigned from Phong Pham',
        }
        const res = await fetch('/api/notifications/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNotification),
        })
        const data = await res.json()

        if (res.status === 201 || res.status === 200) {
            return
        } else {
            throw new Error(data)
        }
    }

    /**
     * Default value with API response
     */
    const defaultJobTypeId = useMemo(() => {
        if (!loadingJobTypes && jobTypes) {
            return jobTypes[0].id!.toString()
        }
        return ''
    }, [jobTypes, loadingJobTypes])

    const defaultJobNo = useMemo(() => {
        if (!loadingJobTypes && jobTypes) {
            const jobNumber = jobTypes[0]._count.projects + 1
            return padToFourDigits(jobNumber)
        }
        return ''
    }, [jobTypes, loadingJobTypes])

    const defaultJobStatusId = useMemo(() => {
        if (!loadingJobStatuses && jobStatuses) {
            return jobStatuses[0].id!.toString()
        }
        return ''
    }, [jobStatuses, loadingJobStatuses])

    const formik = useFormik<NewProject>({
        initialValues: {
            createdById: authUser.id!,
            clientName: '',
            jobTypeId: defaultJobTypeId,
            jobNo: defaultJobNo,
            jobName: '',
            sourceUrl: '',
            startedAt: '',
            dueAt: '',
            memberAssignIds: [],
            income: '',
            staffCost: '',
            paymentChannelId: null as unknown as string,
            jobStatusId: defaultJobStatusId,
        },
        validationSchema: CreateProjectSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                setLoading(true)

                const jobType = jobTypes!.find(
                    (jType) => jType.id!.toString() === values.jobTypeId
                )
                const jobNumber = jobType!._count.projects + 1
                const newJob = {
                    ...values,
                    jobNo: pareJobNo(jobType!.code!, jobNumber),
                }

                await createProject(newJob)

                // values.memberAssignIds.forEach(async (memId) => {
                //     await sendNotification(memId)
                // })

                onClose()
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

    return (
        <form onSubmit={formik.handleSubmit}>
            <Modal
                open={isOpen}
                onCancel={onClose}
                title={<p className="text-lg capitalize">Create new Job</p>}
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
                            className={`relative text-right font-medium text-base pr-2 ${Boolean(formik.touched.dueAt) && formik.errors.dueAt ? 'text-danger' : 'text-secondary'}`}
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
                                            (findJobType?._count.projects ??
                                                0) + 1
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
                                color="secondary"
                                variant="faded"
                                classNames={{
                                    inputWrapper: 'w-full',
                                    label: 'text-right font-medium text-base',
                                }}
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
                        color="secondary"
                        variant="faded"
                        value={formik.values.clientName}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
                            inputWrapper: 'w-full',
                            label: 'text-right font-medium text-base',
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
                        color="secondary"
                        variant="faded"
                        value={formik.values.jobName}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
                            inputWrapper: 'w-full',
                            label: 'text-right font-medium text-base',
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
                        isRequired
                        id="sourceUrl"
                        name="sourceUrl"
                        label="Link"
                        placeholder="e.g. http://example.com/"
                        color="secondary"
                        variant="faded"
                        value={formik.values.sourceUrl}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
                            inputWrapper: 'w-full',
                            label: 'text-right font-medium text-base',
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
                            className={`relative text-right font-medium text-base pr-2 ${Boolean(formik.touched.memberAssignIds) && formik.errors.memberAssignIds ? 'text-danger' : 'text-secondary'}`}
                        >
                            Member Assign
                            <span className="absolute top-0 right-0 text-danger!">
                                *
                            </span>
                        </p>
                        <div className="flex flex-col w-full">
                            <Select
                                options={users?.map((usr) => {
                                    return {
                                        ...usr,
                                        label: usr.name!,
                                        value: usr.id!,
                                    }
                                })}
                                placeholder="Select one or more member"
                                size="large"
                                optionRender={(opt) => {
                                    return (
                                        <div className="flex items-center justify-start gap-4">
                                            <div className="size-12">
                                                <Image
                                                    src={opt.data.avatar!}
                                                    alt={opt.data.name}
                                                    className="size-full rounded-full object-cover"
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
                            className={`relative text-right font-medium text-base pr-2 ${Boolean(formik.touched.dueAt) && formik.errors.dueAt ? 'text-danger' : 'text-secondary'}`}
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
                        maxValue={999999}
                        color="secondary"
                        variant="faded"
                        value={Number(formik.values.income)}
                        onChange={formik.handleChange}
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
                            inputWrapper: 'w-full',
                            label: 'text-right font-medium text-base',
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
                        maxValue={999999}
                        color="secondary"
                        variant="faded"
                        value={Number(formik.values.staffCost)}
                        onChange={formik.handleChange}
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
                            inputWrapper: 'w-full',
                            label: 'text-right font-medium text-base',
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
                            className={`relative text-right font-medium text-base pr-2 ${Boolean(formik.touched.memberAssignIds) && formik.errors.memberAssignIds ? 'text-danger' : 'text-secondary'}`}
                        >
                            Payment Channel
                            <span className="absolute top-0 right-0 text-danger!">
                                *
                            </span>
                        </p>
                        <div className="flex flex-col w-full">
                            <Select
                                options={paymentChannels?.map((channel) => {
                                    return {
                                        ...channel,
                                        label: channel.name!,
                                        value: channel.id!.toString(),
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
