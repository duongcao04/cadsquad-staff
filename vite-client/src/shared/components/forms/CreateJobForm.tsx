import { Divider } from '@heroui/react'
import dayjs, { Dayjs } from 'dayjs'
import { useFormik } from 'formik'
import { useState } from 'react'

import {
    useCreateJobMutation,
    useJobTypes,
    usePaymentChannels,
    useUsers,
} from '@/lib/queries'
import { CreateJobSchema, type TCreateJobInput } from '@/lib/validationSchemas'

import AssignMemberField from '../form-fields/AssignMemberField'
import JobAttachmentsField from '../form-fields/JobAttachmentsField'
import { JobNoField } from '../form-fields/JobNoField'
import { PaymentChannelSelect } from '../form-fields/PaymentChannelSelect'
import { HeroButton } from '../ui/hero-button'
import {
    HeroDateRangePicker,
    type HeroDateRangePickerProps,
} from '../ui/hero-date-picker'
import { HeroInput } from '../ui/hero-input'
import { HeroNumberInput } from '../ui/hero-number-input'
import HeroRowsStep from '../ui/hero-rows-steps'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

type CreateJobFormProps = {
    onSubmit?: () => void
}
export default function CreateJobForm({ onSubmit }: CreateJobFormProps) {
    /**
     * Get initial data
     */
    const { data: users } = useUsers()
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
            startedAt: new Date().toISOString(),
            dueAt: '',
            assigneeIds: ['c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'], // Consider fetching this default dynamically
            incomeCost: null as unknown as number,
            staffCost: null as unknown as number,
            paymentChannelId: null,
        },
        validationSchema: CreateJobSchema,
        onSubmit: async (values) => {
            console.log(values)

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

    const handleDeliveryDateChange = (
        val: { start: Dayjs; end: Dayjs } | null
    ) => {
        const start = val ? val.start.format('YYYY-MM-DD') : undefined
        const end = val ? val.end.format('YYYY-MM-DD') : undefined

        formik.setFieldValue('startedAt', start)
        formik.setFieldValue('dueAt', end)
    }

    const formikAssignees = !Array.isArray(formik.values.assigneeIds)
        ? []
        : users.filter((item) => formik.values.assigneeIds?.includes(item.id))

    return (
        <div className="w-full">
            {/* 1. Stepper Component */}
            <div className="flex justify-center">
                <HeroRowsStep
                    // steps={steps}
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                    className="w-full"
                    // Optional: Prevent clicking future steps
                    steps={steps.map((s, i) => ({
                        ...s,
                        disabled: i > currentStep,
                    }))}
                />
            </div>

            <Divider className="bg-text-3!" />

            <form
                onSubmit={formik.handleSubmit}
                className="size-full flex flex-col justify-between"
            >
                {/* 2. Form Content Area */}

                <ScrollArea className="size-full h-[60vh] pl-7 pr-2">
                    <ScrollBar orientation="horizontal" />
                    <ScrollBar orientation="vertical" />

                    <div className="space-y-6 pr-4 py-5">
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
                                <DeliveryField
                                    value={
                                        formik.values.startedAt &&
                                        formik.values.dueAt
                                            ? {
                                                  start: dayjs(
                                                      formik.values.startedAt
                                                  ),
                                                  end: dayjs(
                                                      formik.values.dueAt
                                                  ),
                                              }
                                            : null
                                    }
                                    invalidStartedAt={
                                        Boolean(formik.touched.startedAt) &&
                                        Boolean(formik.errors.startedAt)
                                    }
                                    invalidDueAt={
                                        Boolean(formik.touched.dueAt) &&
                                        Boolean(formik.errors.dueAt)
                                    }
                                    onValueChange={handleDeliveryDateChange}
                                    errorMessages={{
                                        startedAt: formik.errors
                                            .startedAt as string,
                                        dueAt: formik.errors.dueAt as string,
                                    }}
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
                                                        formik.touched
                                                            .incomeCost
                                                    ) &&
                                                    Boolean(
                                                        formik.errors.incomeCost
                                                    )
                                                }
                                                errorMessage={
                                                    Boolean(
                                                        formik.touched
                                                            .incomeCost
                                                    ) &&
                                                    formik.errors.incomeCost
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
                                                        formik.touched.staffCost
                                                    ) &&
                                                    Boolean(
                                                        formik.errors.staffCost
                                                    )
                                                }
                                                errorMessage={
                                                    Boolean(
                                                        formik.touched.staffCost
                                                    ) && formik.errors.staffCost
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
                                                    formik.touched
                                                        .paymentChannelId
                                                ) &&
                                                Boolean(
                                                    formik.errors
                                                        .paymentChannelId
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
                                    defaultAttachments={
                                        formik.values.attachmentUrls
                                    }
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
                                    assignees={formikAssignees}
                                    onSelectMember={(userIds) => {
                                        formik.setFieldValue(
                                            'assigneeIds',
                                            userIds
                                        )
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <Divider className="bg-text-3!" />

                {/* 3. Footer / Action Buttons */}
                <div className="bg-background flex items-center justify-between pr-7 pt-4 pb-2">
                    <HeroButton
                        variant="light"
                        color="default"
                        onPress={handleBack}
                        isDisabled={currentStep === 0}
                    >
                        Back
                    </HeroButton>

                    {currentStep < steps.length - 1 && (
                        <HeroButton
                            type="button"
                            color="primary"
                            onPress={handleNext}
                        >
                            Next Step
                        </HeroButton>
                    )}
                    {currentStep === steps.length - 1 && (
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

function DeliveryField({
    value,
    onValueChange,
    invalidStartedAt = false,
    invalidDueAt = false,
    errorMessages,
}: {
    value: HeroDateRangePickerProps['value']
    onValueChange: HeroDateRangePickerProps['onChange']
    invalidStartedAt?: boolean
    invalidDueAt?: boolean
    errorMessages?: {
        startedAt?: string
        dueAt?: string
    }
}) {
    return (
        <HeroDateRangePicker
            label={
                <div className="relative w-fit pr-2">
                    <p>Delivery date</p>
                    <span className="absolute text-danger top-0 right-0">
                        *
                    </span>
                </div>
            }
            labelPlacement="outside"
            // Construct the object your wrapper expects
            value={value}
            isClearable
            showMonthAndYearPickers
            onChange={onValueChange}
            // Combine errors from both fields
            isInvalid={invalidStartedAt || invalidDueAt}
            errorMessage={
                <div>
                    {errorMessages?.startedAt && (
                        <p>{errorMessages?.startedAt}</p>
                    )}
                    {errorMessages?.dueAt && <p>{errorMessages?.dueAt}</p>}
                </div>
            }
        />
    )
}
