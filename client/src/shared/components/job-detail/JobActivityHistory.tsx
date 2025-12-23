import { Avatar, Chip, Code, Skeleton, User } from '@heroui/react'
import {
    ArrowRightLeft,
    CheckCircle2,
    CreditCard,
    Edit3,
    FileClock,
    PackageCheck,
    PlusCircle,
    Trash2,
    UserMinus,
    UserPlus,
    type LucideIcon,
} from 'lucide-react'
import { ActivityTypeEnum } from '@/shared/enums'
import type { TJobActivityLog } from '@/shared/types'
import { useQuery } from '@tanstack/react-query'
import { userOptions } from '@/lib/queries/options/user-queries'
import { IMAGES, optimizeCloudinary } from '@/lib'
import lodash from 'lodash'
import React from 'react'

interface JobActivityHistoryProps {
    logs: TJobActivityLog[]
    isLoading?: boolean
}
export const JobActivityHistory: React.FC<JobActivityHistoryProps> = ({
    logs,
    isLoading = false,
}) => {
    if (!isLoading && (!logs || logs.length === 0)) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-default-400">
                <FileClock size={32} strokeWidth={1} className="mb-2" />
                <p className="text-small text-default-500">
                    No activity recorded yet.
                </p>
            </div>
        )
    }

    // Sort logs descending (newest first)
    const sortedLogs = [...(logs || [])].sort(
        (a, b) =>
            new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
    )

    return (
        <div className="relative pl-6 border-l-2 border-default-100 ml-4 my-4 space-y-8">
            {!isLoading
                ? sortedLogs.map((log) => (
                      <ActivityItem key={log.id} log={log} />
                  ))
                : [...Array(3)].map((_, i) => <ActivityItemSkeleton key={i} />)}
        </div>
    )
}

// --- Individual Activity Item ---

const ActivityItem = ({ log }: { log: TJobActivityLog }) => {
    const config = getActivityConfig(log.activityType)
    const Icon = config.icon
    const date = new Date(log.modifiedAt)

    return (
        <div className="relative group">
            {/* Timeline Dot */}
            <div
                className={`absolute -left-[33px] top-1 flex items-center justify-center w-8 h-8 rounded-full border-2 border-background shadow-sm transition-transform group-hover:scale-110 ${config.bgClass} ${config.textClass}`}
            >
                <Icon size={15} />
            </div>

            {/* Content Container */}
            <div className="flex flex-col gap-1.5">
                {/* Header */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Avatar
                            src={optimizeCloudinary(log.modifiedBy.avatar)}
                            name={log.modifiedBy.displayName}
                            className="w-6 h-6 text-[10px]"
                        />
                        <span className="text-sm font-semibold text-default-900">
                            {log.modifiedBy.displayName}
                        </span>
                    </div>
                    <span className="text-[10px] text-default-400">
                        {new Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        }).format(date)}
                    </span>
                </div>

                {/* Main Action Text */}
                <div className="text-small text-default-700">
                    <span className={config.textClass + ' font-medium mr-1'}>
                        {config.label}
                    </span>
                    {/* Dynamic Content based on type */}
                    {renderDiff(log)}
                </div>

                {/* Notes (Optional) */}
                {log.notes && (
                    <div className="mt-1 p-2.5 bg-default-50 rounded-lg border border-default-100 text-xs text-default-500 italic relative">
                        <div className="absolute top-0 left-3 -translate-y-1/2 w-2 h-2 bg-default-50 border-t border-l border-default-100 rotate-45"></div>
                        &quot;{log.notes}&quot;
                    </div>
                )}
            </div>
        </div>
    )
}

// --- Render Logic for Different Activity Types ---

const renderDiff = (log: TJobActivityLog) => {
    switch (log.activityType) {
        case ActivityTypeEnum.CreateJob:
            return (
                <span className="text-default-500">
                    Job created as <Code size="sm">{log.currentValue}</Code>
                </span>
            )

        case ActivityTypeEnum.ChangeStatus:
        case ActivityTypeEnum.DeliverJob: // Deliver acts like a status change visually
            return (
                <span className="inline-flex items-center gap-1.5 flex-wrap mt-1">
                    <span className="text-default-400 text-xs">from</span>
                    <Chip
                        size="sm"
                        variant="flat"
                        classNames={{ content: 'font-medium text-[10px]' }}
                    >
                        {log.previousValue || 'Unknown'}
                    </Chip>
                    <ArrowRightLeft size={12} className="text-default-400" />
                    <Chip
                        size="sm"
                        color={
                            log.activityType === ActivityTypeEnum.DeliverJob
                                ? 'secondary'
                                : 'primary'
                        }
                        variant="flat"
                        classNames={{ content: 'font-bold text-[10px]' }}
                    >
                        {log.currentValue}
                    </Chip>
                </span>
            )

        case ActivityTypeEnum.MarkPaid:
            return (
                <span className="text-default-500">
                    Job has been marked as{' '}
                    <span className="text-success-600 font-bold">Paid</span>.
                </span>
            )

        case ActivityTypeEnum.AssignMember:
        case ActivityTypeEnum.UnassignMember: {
            const prev = safeJsonParse(log.previousValue ?? null)
            const curr = safeJsonParse(log.currentValue ?? null)
            // Use XOR to find the ID that changed
            const diff: string[] = lodash.xor(prev, curr)

            if (diff.length === 0) return null

            return (
                <div className="flex flex-col gap-2 mt-2 pl-2 border-l-2 border-default-100">
                    {diff.map((userId: string) => (
                        <UserDisplay key={userId} userId={userId} />
                    ))}
                </div>
            )
        }

        case ActivityTypeEnum.UpdateInformation:
        case ActivityTypeEnum.RescheduleJob:
        case ActivityTypeEnum.ChangePaymentChannel: {
            // Handle both simple strings and JSON objects
            const isJson =
                isJsonString(log.currentValue ?? null) ||
                isJsonString(log.previousValue ?? null)

            // 1. Complex Object Update (Bulk Update)
            if (isJson) {
                const prevObj = safeJsonParse(log.previousValue ?? null) || {}
                const currObj = safeJsonParse(log.currentValue ?? null) || {}

                // Find keys that changed
                const keys = Object.keys({ ...prevObj, ...currObj }).filter(
                    (k) => !lodash.isEqual(prevObj[k], currObj[k])
                )

                return (
                    <div className="flex flex-col gap-1 mt-2">
                        {keys.map((key) => (
                            <div
                                key={key}
                                className="text-xs grid grid-cols-[100px_1fr] gap-2 items-center"
                            >
                                <span className="text-default-500 capitalize">
                                    {key}:
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="line-through text-danger-300 decoration-danger-300">
                                        {formatValue(prevObj[key])}
                                    </span>
                                    <ArrowRightLeft
                                        size={10}
                                        className="text-default-300"
                                    />
                                    <span className="text-default-700 font-medium">
                                        {formatValue(currObj[key])}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

            // 2. Simple Field Update
            return (
                <div className="mt-1.5 flex items-center gap-2 text-xs bg-default-50 w-fit px-2 py-1 rounded border border-default-100">
                    <span className="font-semibold text-default-600">
                        {log.fieldName}:
                    </span>
                    {log.previousValue && (
                        <span className="line-through text-default-400 decoration-default-400">
                            {formatValue(log.previousValue)}
                        </span>
                    )}
                    <span className="text-default-300">→</span>
                    <span className="font-medium text-default-900">
                        {formatValue(log.currentValue)}
                    </span>
                </div>
            )
        }

        case ActivityTypeEnum.DeleteJob:
            return <span className="text-danger">Job permanently deleted.</span>

        default:
            return null
    }
}

// --- Helper Components & Functions ---

const UserDisplay = ({ userId }: { userId: string }) => {
    const { data: user, isLoading } = useQuery({
        ...userOptions(userId),
        enabled: !!userId,
    })

    if (isLoading) return <Skeleton className="h-8 w-32 rounded-lg" />

    if (!user)
        return <span className="text-xs text-default-400">Unknown User</span>

    return (
        <User
            name={user.displayName}
            description={user.email} // Optional: show email
            avatarProps={{
                src: optimizeCloudinary(user.avatar ?? IMAGES.emptyAvatar),
                size: 'sm',
            }}
        />
    )
}

const ActivityItemSkeleton = () => (
    <div className="relative group pl-2">
        <Skeleton className="absolute -left-[33px] top-1 w-8 h-8 rounded-full" />
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-24 h-4 rounded-md" />
                <Skeleton className="w-16 h-3 rounded-md" />
            </div>
            <Skeleton className="w-3/4 h-4 rounded-md" />
        </div>
    </div>
)

// --- Utilities ---

const formatValue = (val: any) => {
    if (val === null || val === undefined || val === '') return 'Empty'
    if (typeof val === 'boolean') return val ? 'True' : 'False'
    // Try to detect date string
    if (
        typeof val === 'string' &&
        !isNaN(Date.parse(val)) &&
        val.length > 10 &&
        val.includes('-')
    ) {
        return new Date(val).toLocaleDateString('vi-VN')
    }
    return String(val)
}

const safeJsonParse = (str: string | null) => {
    if (!str) return []
    try {
        return JSON.parse(str)
    } catch {
        return [] // Return array/object based on expected context, but [] covers member lists
    }
}

const isJsonString = (str: string | null) => {
    if (!str) return false
    try {
        const o = JSON.parse(str)
        if (o && typeof o === 'object') {
            return true
        }
    } catch (e) {}
    return false
}

const getActivityConfig = (
    type: ActivityTypeEnum
): { icon: LucideIcon; label: string; bgClass: string; textClass: string } => {
    switch (type) {
        case ActivityTypeEnum.CreateJob:
            return {
                icon: PlusCircle,
                label: 'Created Job',
                bgClass: 'bg-default-100',
                textClass: 'text-default-600',
            }
        case ActivityTypeEnum.ChangeStatus:
            return {
                icon: ArrowRightLeft,
                label: 'Changed Status',
                bgClass: 'bg-primary-50',
                textClass: 'text-primary-600',
            }
        case ActivityTypeEnum.DeliverJob:
            return {
                icon: PackageCheck,
                label: 'Delivered Job',
                bgClass: 'bg-secondary-50',
                textClass: 'text-secondary-600',
            }
        case ActivityTypeEnum.MarkPaid:
            return {
                icon: CheckCircle2,
                label: 'Payment',
                bgClass: 'bg-success-50',
                textClass: 'text-success-600',
            }
        case ActivityTypeEnum.AssignMember:
            return {
                icon: UserPlus,
                label: 'Assigned Member',
                bgClass: 'bg-blue-50',
                textClass: 'text-blue-600',
            }
        case ActivityTypeEnum.UnassignMember:
            return {
                icon: UserMinus,
                label: 'Unassigned Member',
                bgClass: 'bg-orange-50',
                textClass: 'text-orange-600',
            }
        case ActivityTypeEnum.ChangePaymentChannel:
            return {
                icon: CreditCard,
                label: 'Payment Channel',
                bgClass: 'bg-default-100',
                textClass: 'text-default-600',
            }
        case ActivityTypeEnum.UpdateInformation:
        case ActivityTypeEnum.RescheduleJob:
            return {
                icon: Edit3,
                label: 'Updated Details',
                bgClass: 'bg-violet-50',
                textClass: 'text-violet-600',
            }
        case ActivityTypeEnum.DeleteJob:
            return {
                icon: Trash2,
                label: 'Deleted Job',
                bgClass: 'bg-danger-50',
                textClass: 'text-danger-600',
            }
        default:
            return {
                icon: Edit3,
                label: 'Updated',
                bgClass: 'bg-default-100',
                textClass: 'text-default-600',
            }
    }
}
