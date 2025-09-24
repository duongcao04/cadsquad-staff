'use client'

import {
    addToast,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@heroui/react'
import React from 'react'
import { lightenHexColor } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useJobStatusByOrder } from '@/shared/queries/useJobStatus'
import JobStatusChip from '@/shared/components/customize/JobStatusChip'
import { useChangeStatusMutation } from '@/shared/queries/useJob'
import { JobStatus } from '@/shared/interfaces/jobStatus.interface'
import { Job } from '@/shared/interfaces/job.interface'

type Props = {
    jobData: Job
    statusData: JobStatus
}
export default function JobStatusDropdown({ jobData, statusData }: Props) {
    const { mutateAsync: changeStatusMutation } = useChangeStatusMutation()
    const { jobStatus: nextStatus } = useJobStatusByOrder(
        statusData.nextStatusOrder
    )
    const { jobStatus: prevStatus } = useJobStatusByOrder(
        statusData.prevStatusOrder
    )

    const handleChangeStatus = async (nextStatus: JobStatus) => {
        try {
            await changeStatusMutation(
                {
                    jobId: jobData.id?.toString(),
                    changeStatusInput: {
                        fromStatusId: jobData?.status.id?.toString(),
                        toStatusId: nextStatus.id?.toString(),
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
            classNames={{
                base: "!z-0",
                content: "!z-0",
                backdrop: "!z-0",
                trigger: "!z-0"
            }}
        >
            <DropdownTrigger className="opacity-100">
                <Chip
                    style={{
                        color: statusData.hexColor,
                        backgroundColor: lightenHexColor(
                            statusData.hexColor as string,
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
                        <p>{statusData.displayName}</p>
                        {dropdownActions.length > 0 && (
                            <ChevronDown size={14} />
                        )}
                    </div>
                </Chip>
            </DropdownTrigger>
            <DropdownMenu aria-label="Job Status Action">
                {dropdownActions.map((item) => {
                    return (
                        <DropdownItem key={item.key} onPress={item.action}>
                            <div className="flex items-center justify-start gap-1">
                                Mark as
                                <JobStatusChip data={item.data} />
                            </div>
                        </DropdownItem>
                    )
                })}
            </DropdownMenu>
        </Dropdown>
    )
}
