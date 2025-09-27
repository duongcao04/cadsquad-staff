'use client'

import {
    addToast,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from '@heroui/react'
import React from 'react'
import { ChevronDown } from 'lucide-react'
import {
    useJobStatusByOrder,
    useJobStatuses,
} from '@/shared/queries/useJobStatus'
import JobStatusChip from '@/shared/components/chips/JobStatusChip'
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
    const { data: jobStatuses } = useJobStatuses()

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

    console.log(jobStatuses)

    const actions: { key: string; data?: JobStatus; action: () => void }[] = [
        {
            key: 'nextStatusOrder',
            data: nextStatus,
            action: () => {
                handleChangeStatus(nextStatus as JobStatus)
            },
        },
        {
            key: 'prevStatusOrder',
            data: prevStatus,
            action: () => {
                handleChangeStatus(prevStatus as JobStatus)
            },
        },
    ]
    const dropdownActions = actions.filter(
        (item) => typeof item.data !== 'undefined'
    )

    // const forceActions =

    return (
        <Dropdown
            placement="bottom-start"
            size="sm"
            classNames={{
                base: '!z-0',
                content: '!z-0',
                backdrop: '!z-0',
                trigger: '!z-0',
            }}
        >
            <DropdownTrigger className="opacity-100">
                <button className="cursor-pointer">
                    <JobStatusChip
                        data={statusData}
                        classNames={{
                            base: '!w-[120px]',
                            content:
                                'uppercase text-xs font-semibold font-saira !w-[120px] text-nowrap line-clamp-1',
                        }}
                        childrenRender={(statusData) => {
                            return (
                                <div className="flex items-center justify-between gap-2">
                                    <p>{statusData.displayName}</p>
                                    <ChevronDown size={14} />
                                </div>
                            )
                        }}
                    />
                </button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Change status action"
                disabledKeys={['notFoundItems']}
            >
                <DropdownSection title="Quick change" showDivider>
                    {dropdownActions.map((item) => {
                        return (
                            <DropdownItem key={item.key} onPress={item.action}>
                                {item.data && (
                                    <div className="flex items-center justify-start gap-1">
                                        Mark as
                                        <JobStatusChip data={item.data} />
                                    </div>
                                )}
                            </DropdownItem>
                        )
                    })}
                </DropdownSection>
                <DropdownSection title="Force change">
                    {!jobStatuses ? (
                        <DropdownItem key={'notFoundItems'}>
                            <p className="text-xs text-center">
                                Không tìm thấy danh sách trạng thái
                            </p>
                        </DropdownItem>
                    ) : (
                        jobStatuses.map((item) => {
                            return (
                                <DropdownItem
                                    key={item.id}
                                    onPress={() => {
                                        handleChangeStatus(item as JobStatus)
                                    }}
                                >
                                    <div className="flex items-center justify-start gap-1">
                                        Mark as
                                        <JobStatusChip data={item} />
                                    </div>
                                </DropdownItem>
                            )
                        })
                    )}
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}
