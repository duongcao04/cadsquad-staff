'use client'

import { NumberInput, NumberInputProps } from '@heroui/react'
import { Skeleton } from '@heroui/react'
import { Select } from 'antd'
import React from 'react'
import { formatCurrencyVND } from '@/lib/formatCurrency'
import Description from '../onboarding/@jobDetail/_components/data-fields/Description'
import CommentForm from '../onboarding/@jobDetail/_components/forms/CommentForm'
import ActivityPanel from '../onboarding/@jobDetail/_components/panels/ActivityPanel'
import JobDetailPanel from '../onboarding/@jobDetail/_components/panels/JobDetailPanel'
import { usePaymentChannels } from '@/shared/queries/usePaymentChannel'
import { useJobByNo } from '@/shared/queries/useJob'
import { Job } from '@/shared/interfaces/job.interface'

type Props = {
    isEditMode?: boolean
    jobNo?: string
}
export default function JobDetailSection({ isEditMode = false, jobNo }: Props) {
    const { job, isLoading } = useJobByNo(jobNo)
    /**
     * Fetch data
     */
    const { data: paymentChannels } = usePaymentChannels()

    /**
     * Input props define
     */
    const numberInputProps: NumberInputProps = {
        classNames: {
            inputWrapper: 'h-[20px]',
        },
        isDisabled: !isEditMode,
        hideStepper: true,
        variant: 'underlined',
    }
    return (
        <>
            <div className="border-1 border-text3 grid grid-cols-3 gap-5 px-5 py-4 rounded-lg divide-x-1 divide-text3">
                <div>
                    <Skeleton
                        className="w-fit h-fit rounded-md"
                        isLoaded={!isLoading}
                    >
                        <p className="text-sm text-text2">Income</p>
                    </Skeleton>
                    <Skeleton className="mt-1 rounded-md" isLoaded={!isLoading}>
                        {!isEditMode ? (
                            <p className="text-base font-semibold">
                                {formatCurrencyVND(
                                    parseInt(String(job?.incomeCost)),
                                    'en-US',
                                    'USD'
                                )}
                            </p>
                        ) : (
                            <NumberInput
                                startContent={
                                    <p className="text-base font-semibold">$</p>
                                }
                                size="sm"
                                value={parseInt(String(job?.incomeCost))}
                                style={{
                                    fontSize: 'var(--text-base)',
                                    fontWeight: '500',
                                    textWrap: 'wrap',
                                }}
                                {...numberInputProps}
                            />
                        )}
                    </Skeleton>
                </div>
                <div>
                    <Skeleton
                        className="w-fit h-fit rounded-md"
                        isLoaded={!isLoading}
                    >
                        <p className="text-sm text-text2">Staff cost</p>
                    </Skeleton>
                    <Skeleton className="mt-1 rounded-md" isLoaded={!isLoading}>
                        {!isEditMode ? (
                            <p className="text-base font-semibold">
                                {formatCurrencyVND(
                                    parseInt(String(job?.staffCost))
                                )}
                            </p>
                        ) : (
                            <NumberInput
                                startContent={
                                    <p className="text-base font-semibold underline">
                                        đ
                                    </p>
                                }
                                value={parseInt(String(job?.staffCost))}
                                style={{
                                    fontSize: 'var(--text-base)',
                                    fontWeight: '500',
                                    textWrap: 'wrap',
                                }}
                                size="sm"
                                {...numberInputProps}
                            />
                        )}
                    </Skeleton>
                </div>
                <div>
                    <Skeleton
                        className="w-fit h-fit rounded-md"
                        isLoaded={!isLoading}
                    >
                        <p className="text-sm text-text2">Payment Channel</p>
                    </Skeleton>
                    <Skeleton className="mt-1 rounded-md" isLoaded={!isLoading}>
                        {!isEditMode ? (
                            <p className="text-base font-semibold text-wrap">
                                {job?.paymentChannel &&
                                    job?.paymentChannel.displayName}
                            </p>
                        ) : (
                            <Select
                                classNames={{
                                    root: 'w-full',
                                }}
                                value={job?.paymentChannel.id}
                                options={paymentChannels?.map((pm) => ({
                                    ...pm,
                                    label: pm.displayName,
                                    value: pm.id,
                                }))}
                            />
                        )}
                    </Skeleton>
                </div>
            </div>
            <hr className="text-text3 my-5" />
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 w-full space-y-2.5">
                    <Description data={job as Job} isLoading={isLoading} />
                    <hr className="text-text3" />
                    <div className="px-1.5">
                        <ActivityPanel
                            data={job as Job}
                            isLoading={isLoading}
                        />
                    </div>
                    <hr className="text-text3 mx-auto max-w-[60%]" />
                    <CommentForm jobId={job?.id as string} />
                </div>
                <div className="col-span-1 w-full">
                    <div className="sticky top-[20px]">
                        <JobDetailPanel
                            data={job as Job}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
