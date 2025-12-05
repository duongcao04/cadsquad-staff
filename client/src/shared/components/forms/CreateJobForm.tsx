'use client'

import {
    useCreateJobMutation,
    useJobTypes,
    usePaymentChannels,
    useUsers,
} from '@/lib/queries'
import { CreateJobSchema, TCreateJobInput } from '@/lib/validationSchemas'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import { useState } from 'react'
import AssignMemberField from '../form-fields/AssignMemberField'
import JobAttachmentsField from '../form-fields/JobAttachmentsField'
import { JobNoField } from '../form-fields/JobNoField'
import { PaymentChannelSelect } from '../form-fields/PaymentChannelSelect'
import { HeroButton } from '../ui/hero-button'
import { HeroDateRangePicker } from '../ui/hero-date-picker'
import { HeroInput } from '../ui/hero-input'
import { HeroNumberInput } from '../ui/hero-number-input'
import HeroRowsStep from '../ui/hero-rows-steps'

type CreateJobFormProps = {
    onSubmit?: () => void
}
export default function CreateJobForm({ onSubmit }: CreateJobFormProps) {
    // const { setNewJobNo } = useJobStore()

    /**
     * Get initial data
     */
    const { users } = useUsers()
    const { data: jobTypes } = useJobTypes()
    const { data: paymentChannels } = usePaymentChannels()

    const createJobMutation = useCreateJobMutation()

    const [currentStep, setCurrentStep] = useState(0)

    const steps: { title: string; description: string }[] = [
        { title: 'Job Details', description: 'Basic info' },
        { title: 'Documents', description: 'Attachments & Files' },
        { title: 'Assignees', description: 'Member Assign' },
    ]

    const fieldsByStep = [
        [
            'no',
            'typeId',
            'displayName',
            'clientName',
            'incomeCost',
            'staffCost',
            'paymentChannelId',
            'startedAt',
            'dueAt',
        ], // Step 0
        ['attachmentUrls'], // Step 1
        ['assigneeIds'], // Step 2
    ]

    const formik = useFormik<TCreateJobInput>({
        initialValues: {
            clientName: '',
            typeId: '',
            no: '',
            displayName: '',
            attachmentUrls: [],
            startedAt: null as unknown as Date,
            dueAt: null as unknown as Date,
            assigneeIds: [], // Consider fetching this default dynamically
            incomeCost: null as unknown as number,
            staffCost: null as unknown as number,
            paymentChannelId: null,
        },
        validationSchema: CreateJobSchema,
        onSubmit: async (values) => {
            await createJobMutation.mutateAsync(values, {
                onSuccess() {
                    // setNewJobNo(values.no)
                    formik.resetForm()
                    onSubmit?.()
                },
            })
        },
    })

    // --- Navigation Handlers ---
    const handleNext = async () => {
        const currentFields = fieldsByStep[currentStep]

        // 1. Mark current step fields as touched to trigger UI errors
        const touchedFields = currentFields.reduce(
            (acc, field) => ({ ...acc, [field]: true }),
            {}
        )
        await formik.setTouched({ ...formik.touched, ...touchedFields })

        // 2. Validate form
        const errors = await formik.validateForm()

        // 3. Check if any current step fields have errors
        const stepHasErrors = currentFields.some(
            (field) => errors[field as keyof typeof errors]
        )

        if (!stepHasErrors) {
            setCurrentStep((prev) => prev + 1)
        }
    }

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1)
    }

    return (
        <div className="w-full">
            {/* 1. Stepper Component */}
            <div className="mb-8 flex justify-center">
                <HeroRowsStep
                    steps={steps}
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                    className="w-full"
                    // Optional: Prevent clicking future steps
                    // steps={steps.map((s, i) => ({ ...s, disabled: i > currentStep }))}
                />
            </div>

            <form
                onSubmit={formik.handleSubmit}
                className="w-full min-h-[200px] flex flex-col justify-between"
            >
                {/* 2. Form Content Area */}
                <div className="space-y-6">
                    {/* STEP 0: JOB DETAILS */}
                    {currentStep === 0 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Job Type Skeleton (From your original code) */}
                            <JobNoField
                                jobTypes={jobTypes}
                                defaultSelectedKey={jobTypes[0]?.id}
                                onSelectionChange={(key, jobNoResult) => {
                                    formik.setFieldValue('typeId', key)
                                    formik.setFieldValue('no', jobNoResult)
                                }}
                            />
                            {/* Job Name */}
                            <HeroInput
                                isRequired
                                id="displayName"
                                name="displayName"
                                label="Job name"
                                labelPlacement="outside-top"
                                placeholder="e.g. 3D Modeling"
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

                            {/* Client Name */}
                            <HeroInput
                                isRequired
                                id="clientName"
                                name="clientName"
                                label="Client name"
                                placeholder="e.g. Tom Jain"
                                value={formik.values.clientName}
                                onChange={formik.handleChange}
                                labelPlacement="outside-top"
                                isInvalid={
                                    Boolean(formik.touched.clientName) &&
                                    Boolean(formik.errors.clientName)
                                }
                                errorMessage={
                                    Boolean(formik.touched.clientName) &&
                                    (formik.errors.clientName as string)
                                }
                            />

                            {/* Start & End Dates */}
                            <HeroDateRangePicker
                                isRequired
                                label="Delivery date"
                                labelPlacement="outside"
                                // Construct the object your wrapper expects
                                value={{
                                    start: dayjs(formik.values.startedAt),
                                    end: dayjs(formik.values.dueAt),
                                }}
                                onChange={(range) => {
                                    // Range returns { start: Dayjs, end: Dayjs } or null
                                    if (range) {
                                        formik.setFieldValue(
                                            'startedAt',
                                            range.start
                                        )
                                        formik.setFieldValue('dueAt', range.end)
                                    } else {
                                        // Handle clear action
                                        formik.setFieldValue('startedAt', null)
                                        formik.setFieldValue('dueAt', null)
                                    }
                                }}
                                // Combine errors from both fields
                                isInvalid={
                                    (Boolean(formik.touched.startedAt) &&
                                        Boolean(formik.errors.startedAt)) ||
                                    (Boolean(formik.touched.dueAt) &&
                                        Boolean(formik.errors.dueAt))
                                }
                                errorMessage={
                                    (Boolean(formik.touched.startedAt) &&
                                        (formik.errors.startedAt as string)) ||
                                    (Boolean(formik.touched.dueAt) &&
                                        (formik.errors.dueAt as string))
                                }
                            />

                            {/* Financial Details */}
                            <div>
                                <p className="text-base font-medium">
                                    Financial Details
                                </p>
                                <div className="mt-8 space-y-4">
                                    <div className="space-y-10">
                                        <HeroNumberInput
                                            isRequired
                                            id="incomeCost"
                                            name="incomeCost"
                                            label="Income"
                                            placeholder="0"
                                            type="number"
                                            labelPlacement="outside"
                                            maxValue={999999999999999}
                                            value={formik.values.incomeCost}
                                            onChange={(value) =>
                                                formik.setFieldValue(
                                                    'incomeCost',
                                                    Number(value)
                                                )
                                            }
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <span className="text-default-400 text-small px-0.5">
                                                        $
                                                    </span>
                                                </div>
                                            }
                                            isInvalid={
                                                Boolean(
                                                    formik.touched.incomeCost
                                                ) &&
                                                Boolean(
                                                    formik.errors.incomeCost
                                                )
                                            }
                                            errorMessage={
                                                Boolean(
                                                    formik.touched.incomeCost
                                                ) && formik.errors.incomeCost
                                            }
                                        />
                                        <HeroNumberInput
                                            isRequired
                                            id="staffCost"
                                            name="staffCost"
                                            label="Staff cost"
                                            placeholder="0"
                                            type="number"
                                            labelPlacement="outside"
                                            maxValue={999999999999999}
                                            value={formik.values.staffCost}
                                            onChange={(value) =>
                                                formik.setFieldValue(
                                                    'staffCost',
                                                    Number(value)
                                                )
                                            }
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <span className="text-default-400 text-small px-0.5">
                                                        $
                                                    </span>
                                                </div>
                                            }
                                            isInvalid={
                                                Boolean(
                                                    formik.touched.incomeCost
                                                ) &&
                                                Boolean(
                                                    formik.errors.incomeCost
                                                )
                                            }
                                            errorMessage={
                                                Boolean(
                                                    formik.touched.incomeCost
                                                ) && formik.errors.incomeCost
                                            }
                                        />
                                    </div>
                                    <PaymentChannelSelect
                                        channels={paymentChannels}
                                        onSelectionChange={(key) => {
                                            const value = key
                                            formik.setFieldValue(
                                                'paymentChannelId',
                                                value
                                            )
                                        }}
                                        selectedKey={
                                            formik.values.paymentChannelId
                                        }
                                        isInvalid={
                                            Boolean(
                                                formik.touched.paymentChannelId
                                            ) &&
                                            Boolean(
                                                formik.errors.paymentChannelId
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 1: DOCUMENTS */}
                    {currentStep === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <JobAttachmentsField
                                onChange={(attachments) => {
                                    formik.setFieldValue(
                                        'attachmentUrls',
                                        attachments
                                    )
                                }}
                            />
                        </div>
                    )}

                    {/* STEP 2: ASSIGN MEMBER */}
                    {currentStep === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <AssignMemberField
                                users={users}
                                assignees={users.filter(
                                    (item) => item.username == 'nb.vy'
                                )}
                                onSelectMember={(userIds) => {
                                    formik.setFieldValue('assigneeIds', userIds)
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* 3. Footer / Action Buttons */}
                <div className="flex items-center justify-between border-t border-default-200 pt-4 mt-4">
                    <HeroButton
                        variant="light"
                        color="default"
                        onPress={handleBack}
                        isDisabled={currentStep === 0}
                    >
                        Back
                    </HeroButton>

                    {currentStep < steps.length - 1 ? (
                        <HeroButton color="primary" onPress={handleNext}>
                            Next Step
                        </HeroButton>
                    ) : (
                        <HeroButton
                            color="primary"
                            type="submit"
                            isLoading={createJobMutation.isPending}
                        >
                            Create Job
                        </HeroButton>
                    )}
                </div>
            </form>
        </div>
    )
}
