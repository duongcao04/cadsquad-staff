'use client'

import {
    addToast,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from '@heroui/react'
import React from 'react'
import { JobStatus } from '@/validationSchemas/job.schema'
import { lightenHexColor } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useJobStatusDetail } from '@/queries/useJobStatus'
import JobStatusChip from '@/shared/components/customize/JobStatusChip'
import { useUpdateJobMutation } from '@/queries/useJob'

type Props = {
    jobId: string
    statusData: JobStatus
}
export default function JobStatusDropdown({ jobId, statusData }: Props) {
    const { mutateAsync: updateJobMutate } = useUpdateJobMutation()
    const { jobStatus: nextStatus } = useJobStatusDetail(
        String(statusData.nextStatusId)
    )
    const { jobStatus: prevStatus } = useJobStatusDetail(
        String(statusData.prevStatusId)
    )

    const handleChangeStatus = async (nextStatus: JobStatus) => {
        try {
            await updateJobMutate(
                {
                    jobId,
                    updateJobInput: {
                        jobStatusId: nextStatus.id,
                    },
                },
                {
                    onSuccess: () => {
                        addToast({
                            title: 'Cập nhật trạng thái thành công',
                            color: 'success',
                        })
                    },
                    onError: () => {
                        addToast({
                            title: 'Cập nhật trạng thái thất bại',
                            color: 'danger',
                        })
                    },
                }
            )
        } catch (error) {
            console.log(error)
            addToast({
                title: 'Cập nhật trạng thái thất bại',
                color: 'danger',
            })
        }
    }

    const actions: { key: string; data: JobStatus; action: () => void }[] = [
        {
            key: 'next',
            data: nextStatus as JobStatus,
            action: () => {
                handleChangeStatus(nextStatus as JobStatus)
            },
        },
        {
            key: 'prev',
            data: prevStatus as JobStatus,
            action: () => {
                handleChangeStatus(prevStatus as JobStatus)
            },
        },
    ]
    const dropdownActions = actions.filter((item) => item.data)

    return (
        <Dropdown
            placement="bottom"
            size="sm"
            isTriggerDisabled={dropdownActions.length === 0}
        >
            <DropdownTrigger className="opacity-100">
                <Chip
                    style={{
                        color: statusData?.color,
                        backgroundColor: lightenHexColor(
                            statusData?.color as string,
                            85
                        ),
                    }}
                    variant="solid"
                    classNames={{
                        base: '!w-[120px]',
                        content:
                            'uppercase text-xs font-semibold font-saira !w-[120px] text-nowrap line-clamp-1',
                    }}
                >
                    <div className="flex items-center justify-between gap-2">
                        <p>{statusData?.title}</p>
                        {dropdownActions.length > 0 && (
                            <ChevronDown size={14} />
                        )}
                    </div>
                </Chip>
            </DropdownTrigger>
            <DropdownMenu aria-label="Job Status Action">
                {dropdownActions.map((item) => {
                    return (
                        <DropdownSection key={item.key}>
                            <DropdownItem key={item.key} onPress={item.action}>
                                <div className="flex items-center justify-start gap-1">
                                    Mark as
                                    <JobStatusChip data={item.data} />
                                </div>
                            </DropdownItem>
                        </DropdownSection>
                    )
                })}
            </DropdownMenu>
        </Dropdown>
    )
}
