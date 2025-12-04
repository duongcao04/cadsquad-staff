'use client'

import { ApiError } from '@/lib/axios'
import {
    useCreateJobMutation,
    useJobTypes,
    usePaymentChannels,
    useProfile,
    useUsers,
} from '@/lib/queries'
import { CreateJobSchema, TCreateJobInput } from '@/lib/validationSchemas'
import { addToast } from '@heroui/react'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import { useMemo, useState } from 'react'
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
    const { profile } = useProfile()
    const { users, isLoading: loadingUsers } = useUsers()
    const { data: jobTypes, isLoading: isLoadingJobTypes } = useJobTypes()
    const { data: paymentChannels, isLoading: loadingPaymentChannels } =
        usePaymentChannels()

    const { mutateAsync: createJobMutation, isPending: isCreatingJob } =
        useCreateJobMutation()

    const [currentStep, setCurrentStep] = useState(0)

    const steps: { title: string; description: string }[] = [
        { title: 'Job Details', description: 'Basic info' },
        { title: 'Attachments', description: 'Attachments & Files' },
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

    const initialValues = useMemo<TCreateJobInput>(
        () => ({
            clientName: '',
            typeId: '',
            no: '',
            displayName: '',
            attachmentUrls: [],
            startedAt: null as unknown as Date,
            dueAt: null as unknown as Date,
            assigneeIds: ['c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'], // Consider fetching this default dynamically
            incomeCost: null as unknown as number,
            staffCost: null as unknown as number,
            paymentChannelId: null as unknown as string,
            createdById: profile?.id ?? '',
        }),
        [profile?.id]
    )

    const formik = useFormik<TCreateJobInput>({
        initialValues,
        validationSchema: CreateJobSchema,
        onSubmit: async (values) => {
            await createJobMutation(values, {
                onSuccess(res) {
                    addToast({ title: res.data.message, color: 'success' })
                    // setNewJobNo(values.no)
                    formik.resetForm()
                    onSubmit?.()
                },
                onError(error) {
                    const errorRes = error as unknown as ApiError
                    addToast({
                        title: errorRes.error,
                        description: `Error: ${errorRes.message}`,
                        color: 'danger',
                    })
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
                <div className="py-4 space-y-6">
                    {/* STEP 0: JOB DETAILS */}
                    {currentStep === 0 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Job Type Skeleton (From your original code) */}
                            <JobNoField
                                jobTypes={jobTypes}
                                onSelectionChange={() => {}}
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
                                    (formik.touched.startedAt &&
                                        !!formik.errors.startedAt) ||
                                    (formik.touched.dueAt &&
                                        !!formik.errors.dueAt)
                                }
                                errorMessage={
                                    (formik.touched.startedAt &&
                                        (formik.errors.startedAt as string)) ||
                                    (formik.touched.dueAt &&
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

                    {/* STEP 1: FINANCIALS */}
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <p className="text-base font-medium mb-4">
                                    Financial Details
                                </p>
                                <div className="space-y-6">
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
                                            Boolean(formik.errors.incomeCost)
                                        }
                                        errorMessage={
                                            Boolean(
                                                formik.touched.incomeCost
                                            ) &&
                                            (formik.errors.incomeCost as string)
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
                                            Boolean(formik.touched.staffCost) &&
                                            Boolean(formik.errors.staffCost)
                                        }
                                        errorMessage={
                                            Boolean(formik.touched.staffCost) &&
                                            (formik.errors.staffCost as string)
                                        }
                                    />

                                    <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
                                        <p
                                            className={`text-right font-semibold text-base pr-2 ${
                                                Boolean(
                                                    formik.touched
                                                        .paymentChannelId
                                                ) &&
                                                formik.errors.paymentChannelId
                                                    ? 'text-danger'
                                                    : 'text-primary'
                                            }`}
                                        >
                                            Payment channel
                                        </p>

                                        {/* Uncommented and adapted your Select Logic */}
                                        {/* <HeroSelect
                                            isLoading={loadingPaymentChannels}
                                            id="paymentChannelId"
                                            name="paymentChannelId"
                                            placeholder="Select one payment channel"
                                            size="md"
                                            selectedKeys={formik.values.paymentChannelId ? [formik.values.paymentChannelId] : []}
                                            onChange={(e) => {
                                                formik.setFieldValue('paymentChannelId', e.target.value);
                                                formik.setFieldTouched('paymentChannelId', true, false);
                                            }}
                                            isInvalid={Boolean(formik.touched.paymentChannelId) && Boolean(formik.errors.paymentChannelId)}
                                            errorMessage={Boolean(formik.touched.paymentChannelId) && formik.errors.paymentChannelId as string}
                                        >
                                            {paymentChannels?.map((paymentChannel) => (
                                                <HeroSelectItem key={paymentChannel.id} textValue={paymentChannel.displayName}>
                                                    <div className="flex items-center justify-start gap-2">
                                                        <div
                                                            className="size-2 rounded-full"
                                                            style={{ backgroundColor: paymentChannel.hexColor || 'transparent' }}
                                                        />
                                                        <p>{paymentChannel.displayName}</p>
                                                    </div>
                                                </HeroSelectItem>
                                            ))}
                                        </HeroSelect> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: SCHEDULING */}
                    {currentStep === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <p className="text-base font-medium mb-1.5">
                                    Start & End Dates
                                </p>
                                <p
                                    className={`w-fit relative text-left font-medium text-sm pl-1 pr-2.5 ${
                                        (Boolean(formik.touched.startedAt) ||
                                            Boolean(formik.touched.dueAt)) &&
                                        (formik.errors.startedAt ||
                                            formik.errors.dueAt)
                                            ? 'text-danger'
                                            : 'text-text-7!'
                                    }`}
                                >
                                    Delivery date
                                    <span className="absolute top-0 right-0 text-danger!">
                                        *
                                    </span>
                                </p>
                                <div className="mt-1 flex flex-col w-full">
                                    {/* <HeroDateRangePicker
                                        isRequired
                                        value={{
                                            start: formik.values.startedAt ? parseDate(dayjs(formik.values.startedAt).format('YYYY-MM-DD')) : null,
                                            end: formik.values.dueAt ? parseDate(dayjs(formik.values.dueAt).format('YYYY-MM-DD')) : null
                                        }}
                                        onChange={(value) => {
                                            if (value?.start) formik.setFieldValue('startedAt', dayjs(value.start.toString()).toISOString());
                                            if (value?.end) formik.setFieldValue('dueAt', dayjs(value.end.toString()).toISOString());
                                        }}
                                    /> */}
                                    {formik.touched.dueAt &&
                                        formik.errors.dueAt && (
                                            <p className="mt-1 text-xs text-danger">
                                                {formik.errors.dueAt as string}
                                            </p>
                                        )}
                                    {formik.touched.startedAt &&
                                        formik.errors.startedAt && (
                                            <p className="mt-1 text-xs text-danger">
                                                {
                                                    formik.errors
                                                        .startedAt as string
                                                }
                                            </p>
                                        )}
                                </div>
                            </div>
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
                            isLoading={isCreatingJob}
                        >
                            Create Job
                        </HeroButton>
                    )}
                </div>
            </form>
        </div>
    )
}
