'use client'

import {
    addToast,
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Tab,
    Tabs,
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
import { lightenHexColor } from '@/lib/utils'
import { RoleEnum } from '@/shared/enums/role.enum'
import useAuth from '@/shared/queries/useAuth'
import { DefaultJobStatusCode } from '@/shared/enums/default-job-status-code.enum'

type Props = {
    jobData: Job
    statusData: JobStatus
}
export default function JobStatusDropdown({ jobData, statusData }: Props) {
    const { userRole } = useAuth()
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

    const actions: { key: string; data?: JobStatus; action: () => void }[] = [
        {
            key: 'nextStatusOrder',
            data:
                userRole === RoleEnum.ADMIN
                    ? nextStatus
                    : nextStatus?.code === DefaultJobStatusCode.DELIVERED
                    ? nextStatus
                    : undefined,
            action: () => {
                handleChangeStatus(nextStatus as JobStatus)
            },
        },
        {
            key: 'prevStatusOrder',
            data:
                userRole === RoleEnum.ADMIN
                    ? prevStatus
                    : prevStatus?.code === DefaultJobStatusCode.DELIVERED
                    ? prevStatus
                    : undefined,
            action: () => {
                handleChangeStatus(prevStatus as JobStatus)
            },
        },
    ]
    const dropdownActions = actions.filter(
        (item) => typeof item.data !== 'undefined'
    )

    return (
        <Popover
            placement="bottom-start"
            size="sm"
            classNames={{
                base: '!z-0',
                content: '!z-0 py-2 w-[300px]',
                backdrop: '!z-0',
                trigger: '!z-0',
            }}
            showArrow={true}
        >
            <PopoverTrigger className="opacity-100">
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
            </PopoverTrigger>
            <PopoverContent aria-label="Change status action">
                <Tabs
                    aria-label="Job status change tabs"
                    fullWidth
                    classNames={{
                        base: 'size-full',
                        panel: 'size-full',
                    }}
                >
                    <Tab key="quick" title="Quick change">
                        <div className="size-full space-y-2.5">
                            {!dropdownActions.length ? (
                                <p className="py-3 font-medium text-center text-text2">
                                    Cannot quick change
                                </p>
                            ) : (
                                dropdownActions.map((item) => {
                                    return (
                                        <Button
                                            key={item.key}
                                            className="w-full"
                                            style={{
                                                backgroundColor:
                                                    lightenHexColor(
                                                        item.data?.hexColor
                                                            ? item.data
                                                                  ?.hexColor
                                                            : '#ffffff',
                                                        90
                                                    ),
                                            }}
                                            onPress={item.action}
                                        >
                                            {item.data && (
                                                <div className="flex items-center justify-start gap-2">
                                                    <div
                                                        className="size-2 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                item.data
                                                                    ?.hexColor
                                                                    ? item.data
                                                                          ?.hexColor
                                                                    : '#ffffff',
                                                        }}
                                                    />
                                                    <p
                                                        className="font-semibold"
                                                        style={{
                                                            color: item.data
                                                                ?.hexColor
                                                                ? item.data
                                                                      ?.hexColor
                                                                : '#ffffff',
                                                        }}
                                                    >
                                                        {item.data.displayName}
                                                    </p>
                                                </div>
                                            )}
                                        </Button>
                                    )
                                })
                            )}
                        </div>
                    </Tab>
                    {userRole !== RoleEnum.USER && (
                        <Tab key="force" title="Force change">
                            <p className="text-text2 text-xs">Mark status as</p>
                            <hr className="mt-2 mb-3 text-text3" />
                            {!jobStatuses ? (
                                <p className="text-xs text-center">
                                    Không tìm thấy danh sách trạng thái
                                </p>
                            ) : (
                                <div className="size-full space-y-2.5">
                                    {jobStatuses.map((item) => {
                                        return (
                                            <Button
                                                key={item.id}
                                                className="w-full"
                                                style={{
                                                    backgroundColor:
                                                        lightenHexColor(
                                                            item?.hexColor
                                                                ? item?.hexColor
                                                                : '#ffffff',
                                                            90
                                                        ),
                                                }}
                                                onPress={() => {
                                                    handleChangeStatus(item)
                                                }}
                                            >
                                                {item && (
                                                    <div className="flex items-center justify-start gap-2">
                                                        <div
                                                            className="size-2 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    item?.hexColor
                                                                        ? item?.hexColor
                                                                        : '#ffffff',
                                                            }}
                                                        />
                                                        <p
                                                            className="font-semibold"
                                                            style={{
                                                                color: item?.hexColor
                                                                    ? item?.hexColor
                                                                    : '#ffffff',
                                                            }}
                                                        >
                                                            {item.displayName}
                                                        </p>
                                                    </div>
                                                )}
                                            </Button>
                                        )
                                    })}
                                </div>
                            )}
                        </Tab>
                    )}
                </Tabs>
            </PopoverContent>
        </Popover>
    )
}
