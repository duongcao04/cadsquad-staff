import React, { useState } from 'react'

import { Button, Input, NumberInput, addToast } from '@heroui/react'
import { Modal } from 'antd'
import { useFormik } from 'formik'

import {
    CreateProjectSchema,
    NewProject,
} from '@/validationSchemas/project.schema'

import DateTimePicker from './form-fields/DateTimePicker'
import SelectMember from './form-fields/SelectMember'

type Props = {
    isOpen: boolean
    onClose: () => void
}
export default function JobModal({ isOpen, onClose }: Props) {
    const [isLoading, setLoading] = useState(false)

    const formik = useFormik<NewProject>({
        initialValues: {
            jobName: '',
            jobNo: '',
            price: '',
            sourceUrl: '',
            startedAt: '',
            dueAt: '',
            memberAssignIds: [],
            thumbnail: 'https://www.csdvietnam.com/assets/img/logo.webp',
        },
        validationSchema: CreateProjectSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true)
                const res = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                })
                const data = await res.json()

                if (res.status === 201) {
                    addToast({
                        title: 'Create project successfully!',
                        color: 'success',
                    })
                } else {
                    throw new Error(data)
                }
            } catch (error) {
                addToast({
                    title: 'Create project failed!',
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
                title={<p className="capitalize text-lg">Create new Job</p>}
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
                                Send Offer
                            </Button>
                        </div>
                    )
                }}
            >
                <div className="space-y-4 py-8 border-t border-border">
                    <Input
                        isRequired
                        id="jobNo"
                        name="jobNo"
                        label="Job No."
                        placeholder="e.g. FV.0001"
                        value={formik.values.jobNo}
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
                            Boolean(formik.touched.jobNo) &&
                            Boolean(formik.errors.jobNo)
                        }
                        errorMessage={
                            Boolean(formik.touched.jobNo) && formik.errors.jobNo
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
                        <div className="w-full flex flex-col">
                            <SelectMember form={formik} />
                            {Boolean(formik.touched.sourceUrl) &&
                                Boolean(formik.errors.sourceUrl) && (
                                    <p className="text-xs text-danger mt-1">
                                        {formik.errors.memberAssignIds}
                                    </p>
                                )}
                        </div>
                    </div>
                    <NumberInput
                        isRequired
                        id="price"
                        name="price"
                        label="Price"
                        placeholder="0"
                        color="secondary"
                        variant="faded"
                        value={Number(formik.values.price)}
                        onChange={formik.handleChange}
                        labelPlacement="outside-left"
                        classNames={{
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
                            inputWrapper: 'w-full',
                            label: 'text-right font-medium text-base',
                        }}
                        isInvalid={
                            Boolean(formik.touched.price) &&
                            Boolean(formik.errors.price)
                        }
                        errorMessage={
                            Boolean(formik.touched.price) && formik.errors.price
                        }
                        size="lg"
                    />
                    <div className="grid grid-cols-[0.25fr_1fr] gap-3 items-center">
                        <p
                            className={`relative text-right font-medium text-base pr-2 ${Boolean(formik.touched.dueAt) && formik.errors.dueAt ? 'text-danger' : 'text-secondary'}`}
                        >
                            Delivery
                            <span className="absolute top-0 right-0 text-danger!">
                                *
                            </span>
                        </p>
                        <div className="w-full flex flex-col">
                            <DateTimePicker form={formik} />
                            {Boolean(formik.touched.dueAt) &&
                                Boolean(formik.errors.dueAt) && (
                                    <p className="text-xs text-danger mt-1">
                                        {formik.errors.dueAt}
                                    </p>
                                )}
                        </div>
                    </div>
                </div>
            </Modal>
        </form>
    )
}
