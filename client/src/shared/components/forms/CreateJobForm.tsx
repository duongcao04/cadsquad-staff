import { Divider } from '@heroui/react'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import { useState, useMemo } from 'react'

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
import { HeroDateRangePicker } from '../ui/hero-date-picker'
import { HeroInput } from '../ui/hero-input'
import { HeroNumberInput } from '../ui/hero-number-input'
import HeroRowsStep from '../ui/hero-rows-steps'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

type CreateJobFormProps = {
    onSubmit?: () => void
}

export default function CreateJobForm({ onSubmit }: CreateJobFormProps) {
    /**
     * Keep your original Fetching logic
     */
    const { data: users = [] } = useUsers()
    const { data: jobTypes = [] } = useJobTypes()
    const { data: paymentChannels = [] } = usePaymentChannels()
    const createJobMutation = useCreateJobMutation()

    const [currentStep, setCurrentStep] = useState(0)

    const steps = [
        { title: 'Job Details', description: 'Basic info' },
        { title: 'Documents', description: 'Attachments' },
        { title: 'Assignees', description: 'Costs per Member' },
    ]

    const fieldsByStep = [
        [
            'no',
            'typeId',
            'displayName',
            'clientName',
            'incomeCost',
            'paymentChannelId',
            'startedAt',
            'dueAt',
        ],
        ['attachmentUrls'],
        ['assigneeIds', 'assignments'], // assignments is the new hidden helper
    ]

    const formik = useFormik<
        TCreateJobInput & {
            assignments: { userId: string; staffCost: number }[]
        }
    >({
        initialValues: {
            clientName: '',
            typeId: '',
            no: '',
            displayName: '',
            attachmentUrls: [],
            startedAt: dayjs().toISOString(),
            dueAt: '',
            assigneeIds: ['c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'],
            assignments: [
                {
                    userId: 'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24',
                    staffCost: 0,
                },
            ],
            incomeCost: null as unknown as number,
            staffCost: 0, // This will now represent the SUM
            paymentChannelId: null,
        },
        validationSchema: CreateJobSchema,
        onSubmit: async (values) => {
            // Before submitting, we can ensure staffCost is the sum of all assignments
            const totalStaffCost = values.assignments.reduce(
                (sum, a) => sum + (a.staffCost || 0),
                0
            )
            const submissionData = { ...values, staffCost: totalStaffCost }

            await createJobMutation.mutateAsync(submissionData, {
                onSuccess() {
                    formik.resetForm()
                    onSubmit?.()
                },
            })
        },
    })

    const handleNext = async () => {
        const currentFields = fieldsByStep[currentStep]
        const touchedFields = currentFields.reduce(
            (acc, field) => ({ ...acc, [field]: true }),
            {}
        )
        await formik.setTouched({ ...formik.touched, ...touchedFields })

        const errors = await formik.validateForm()
        const stepHasErrors = currentFields.some(
            (field) => errors[field as keyof typeof errors]
        )

        if (!stepHasErrors) setCurrentStep((prev) => prev + 1)
    }

    const handleBack = () => setCurrentStep((prev) => prev - 1)

    // Helper to find selected user objects
    const formikAssignees = useMemo(
        () => users.filter((u) => formik.values.assigneeIds?.includes(u.id)),
        [users, formik.values.assigneeIds]
    )

    return (
        <div className="w-full">
            {/* 1. Stepper Component */}
            <div className="flex justify-center">
                <HeroRowsStep
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                    className="w-full"
                    steps={steps.map((s, i) => ({
                        ...s,
                        disabled: i > currentStep,
                    }))}
                />
            </div>

            <Divider className="bg-border-default" />

            <form
                onSubmit={formik.handleSubmit}
                className="size-full flex flex-col justify-between"
            >
                <ScrollArea className="size-full h-[60vh] pl-7 pr-2">
                    <ScrollBar orientation="horizontal" />
                    <ScrollBar orientation="vertical" />
                    <div className="space-y-6 pr-4 py-5">
                        {/* STEP 0: JOB DETAILS */}
                        {currentStep === 0 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
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
                                <DeliveryField
                                    value={{
                                        start: dayjs(formik.values.startedAt),
                                        end: formik.values.dueAt
                                            ? dayjs(formik.values.dueAt)
                                            : dayjs(),
                                    }}
                                    onValueChange={(val: any) => {
                                        formik.setFieldValue(
                                            'startedAt',
                                            val?.start.toISOString()
                                        )
                                        formik.setFieldValue(
                                            'dueAt',
                                            val?.end.toISOString()
                                        )
                                    }}
                                />
                                <div>
                                    <p className="text-base font-medium">
                                        Financial Details
                                    </p>
                                    <div className="mt-8 space-y-4">
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
                                    onChange={(urls) =>
                                        formik.setFieldValue(
                                            'attachmentUrls',
                                            urls
                                        )
                                    }
                                />
                            </div>
                        )}

                        {/* STEP 2: ASSIGN MEMBER & INDIVIDUAL COSTS */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <AssignMemberField
                                    users={users}
                                    assignees={formikAssignees}
                                    onSelectMember={(userIds) => {
                                        // 1. Update your original field
                                        formik.setFieldValue(
                                            'assigneeIds',
                                            userIds
                                        )

                                        // 2. Sync your cost helper array
                                        const updatedAssignments = userIds.map(
                                            (id) => {
                                                const existing =
                                                    formik.values.assignments.find(
                                                        (a) => a.userId === id
                                                    )
                                                return (
                                                    existing || {
                                                        userId: id,
                                                        staffCost: 0,
                                                    }
                                                )
                                            }
                                        )
                                        formik.setFieldValue(
                                            'assignments',
                                            updatedAssignments
                                        )
                                    }}
                                />

                                <div className="mt-4 space-y-3">
                                    <p className="text-sm font-semibold text-default-600">
                                        Cost Distribution
                                    </p>
                                    {formik.values.assignments.map(
                                        (assignment, index) => {
                                            const user = users.find(
                                                (u) =>
                                                    u.id === assignment.userId
                                            )
                                            return (
                                                <div
                                                    key={assignment.userId}
                                                    className="flex items-center gap-4 p-3 bg-default-50 rounded-xl border border-divider"
                                                >
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold">
                                                            {user?.displayName}
                                                        </p>
                                                        <p className="text-xs text-default-500">
                                                            {user?.role}
                                                        </p>
                                                    </div>
                                                    <div className="w-32">
                                                        <HeroNumberInput
                                                            size="sm"
                                                            placeholder="Cost"
                                                            value={
                                                                assignment.staffCost
                                                            }
                                                            onValueChange={(
                                                                val
                                                            ) =>
                                                                formik.setFieldValue(
                                                                    `assignments[${index}].staffCost`,
                                                                    val
                                                                )
                                                            }
                                                            startContent={
                                                                <span className="text-tiny text-default-400">
                                                                    $
                                                                </span>
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

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

function DeliveryField({ value, onValueChange }: any) {
    return (
        <HeroDateRangePicker
            label="Delivery date"
            labelPlacement="outside"
            value={value}
            onChange={onValueChange}
            isRequired
        />
    )
}
