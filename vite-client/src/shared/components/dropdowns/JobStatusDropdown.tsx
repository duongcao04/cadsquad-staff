import {
    addToast,
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Tab,
    Tabs,
} from '@heroui/react'
import { ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'

import {
    useChangeStatusMutation,
    useJobStatusByOrder,
    useJobStatuses,
    useProfile,
} from '@/lib/queries'
import { darkenHexColor, JOB_STATUS_CODES, lightenHexColor } from '@/lib/utils'
import type { TJob, TJobStatus } from '@/shared/types'

import { JobStatusChip } from '../chips/JobStatusChip'

type JobStatusDropdownProps = {
    jobData: TJob
    statusData: TJobStatus
}
export default function JobStatusDropdown({
    jobData,
    statusData,
}: JobStatusDropdownProps) {
    const { resolvedTheme } = useTheme()

    const { isAdmin } = useProfile()
    const { mutateAsync: changeStatusMutation } = useChangeStatusMutation()
    const { jobStatus: nextStatus } = useJobStatusByOrder(
        statusData.nextStatusOrder
    )
    const { jobStatus: prevStatus } = useJobStatusByOrder(
        statusData.prevStatusOrder
    )
    const { data: jobStatuses } = useJobStatuses()

    const handleChangeStatus = async (nextStatus: TJobStatus) => {
        try {
            await changeStatusMutation(
                {
                    jobId: jobData.id?.toString(),
                    data: {
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

    const actions: { key: string; data?: TJobStatus; action: () => void }[] = [
        {
            key: 'nextStatusOrder',
            data: isAdmin
                ? nextStatus
                : nextStatus?.code === JOB_STATUS_CODES.delivered
                  ? nextStatus
                  : undefined,
            action: () => {
                handleChangeStatus(nextStatus as TJobStatus)
            },
        },
        {
            key: 'prevStatusOrder',
            data: isAdmin
                ? prevStatus
                : prevStatus?.code === JOB_STATUS_CODES.delivered
                  ? prevStatus
                  : undefined,
            action: () => {
                handleChangeStatus(prevStatus as TJobStatus)
            },
        },
    ]
    const dropdownActions = actions.filter(
        (item) => typeof item.data !== 'undefined'
    )

    const getBackgroundColor = (data?: TJobStatus) => {
        return resolvedTheme === 'light'
            ? data
                ? lightenHexColor(
                      data?.hexColor ? data.hexColor : '#ffffff',
                      90
                  )
                : '#ffffff'
            : data
              ? darkenHexColor(data?.hexColor ? data.hexColor : '#000000', 70)
              : '#000000'
    }

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
                                <p className="py-3 font-medium text-center text-text-muted">
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
                                                    getBackgroundColor(
                                                        item.data
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
                    {isAdmin && (
                        <Tab key="force" title="Force change">
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
                                                        getBackgroundColor(
                                                            item
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
                <p className="border-t-1 border-text-muted pt-1.5 w-full text-center text-text-muted">
                    <span className="font-bold">#{jobData?.no}</span> / Update
                    status
                </p>
            </PopoverContent>
        </Popover>
    )
}
