import { Avatar, Chip, ScrollShadow } from '@heroui/react'
import {
    ArrowRightLeft,
    CreditCard,
    Edit3,
    FileClock,
    type LucideIcon,
    PlusCircle,
    Trash2,
    UserMinus,
    UserPlus,
} from 'lucide-react'

import { ActivityTypeEnum } from '@/shared/enums'
import type { TJobActivityLog } from '@/shared/types'

interface JobActivityHistoryProps {
    logs: TJobActivityLog[]
}
export const JobActivityHistory: React.FC<JobActivityHistoryProps> = ({
    logs,
}) => {
    console.log(logs)

    if (!logs || logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-default-400">
                <FileClock size={32} strokeWidth={1} className="mb-2" />
                <p className="text-text-subdued text-sm">
                    No activity recorded yet.
                </p>
            </div>
        )
    }

    // Sort logs descending (newest first)
    const sortedLogs = [...logs].sort(
        (a, b) =>
            new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
    )

    return (
        <ScrollShadow className="h-full w-full pr-4 max-h-125">
            <div className="relative pl-4 border-l border-default-200 ml-4 my-2 space-y-8">
                {sortedLogs.map((log) => (
                    <ActivityItem key={log.id} log={log} />
                ))}
            </div>
        </ScrollShadow>
    )
}

// --- Sub-component for individual items ---

const ActivityItem = ({ log }: { log: TJobActivityLog }) => {
    const config = getActivityConfig(log.activityType)
    const Icon = config.icon
    const date = new Date(log.modifiedAt)

    return (
        <div className="relative">
            {/* Timeline Dot with Icon */}
            <div
                className={`absolute -left-7.25 top-0 flex items-center justify-center w-8 h-8 rounded-full border-2 border-background ${config.bgClass} ${config.textClass}`}
            >
                <Icon size={14} />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
                {/* Header: User & Time */}
                <div className="flex items-center gap-2 mb-1">
                    <Avatar
                        src={log.modifiedBy.avatar}
                        name={log.modifiedBy.displayName}
                        // size="xs"
                        className="w-5 h-5 text-[9px]"
                    />
                    <span className="text-xs font-semibold text-default-800">
                        {log.modifiedBy.displayName}
                    </span>
                    <span className="text-[10px] text-default-400">
                        •{' '}
                        {new Intl.DateTimeFormat('vi-VN', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                        }).format(date)}
                    </span>
                </div>

                {/* Action Description */}
                <div className="text-sm text-default-600">
                    <span className="font-medium">{config.label}</span>
                    {renderDiff(log)}
                </div>

                {/* Optional Notes */}
                {log.notes && (
                    <div className="mt-1 p-2 bg-default-100 rounded text-xs italic text-default-500">
                        &quot;{log.notes}&quot;
                    </div>
                )}
            </div>
        </div>
    )
}

// --- Helpers for formatting and icons ---

const renderDiff = (log: TJobActivityLog) => {
    switch (log.activityType) {
        case ActivityTypeEnum.ChangeStatus:
            return (
                <span className="ml-1">
                    from{' '}
                    <Chip
                        size="sm"
                        variant="flat"
                        className="h-5 text-[10px] px-1"
                    >
                        {log.previousValue}
                    </Chip>{' '}
                    to{' '}
                    <Chip
                        size="sm"
                        variant="solid"
                        color="primary"
                        className="h-5 text-[10px] px-1"
                    >
                        {log.currentValue}
                    </Chip>
                </span>
            )
        case ActivityTypeEnum.AssignMember:
        case ActivityTypeEnum.UnassignMember:
            return (
                <span className="ml-1 font-semibold text-default-900">
                    {log.currentValue}
                </span>
            )

        case ActivityTypeEnum.UpdateInformation:
            return (
                <div className="mt-1 text-xs bg-default-50 p-2 rounded border border-default-100 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                    <span className="text-default-400">Field:</span>
                    <span className="font-mono text-default-700">
                        {log.fieldName}
                    </span>

                    {log.previousValue && (
                        <>
                            <span className="text-danger-400">Old:</span>
                            <span className="line-through text-default-500">
                                {log.previousValue}
                            </span>
                        </>
                    )}

                    <span className="text-success-600">New:</span>
                    <span className="font-medium text-default-900">
                        {log.currentValue}
                    </span>
                </div>
            )

        default:
            return null
    }
}

const getActivityConfig = (
    type: ActivityTypeEnum
): { icon: LucideIcon; label: string; bgClass: string; textClass: string } => {
    switch (type) {
        case ActivityTypeEnum.CreateJob:
            return {
                icon: PlusCircle,
                label: 'Created the job',
                bgClass: 'bg-success-100',
                textClass: 'text-success-600',
            }
        case ActivityTypeEnum.ChangeStatus:
            return {
                icon: ArrowRightLeft,
                label: 'Changed status',
                bgClass: 'bg-primary-100',
                textClass: 'text-primary-600',
            }
        case ActivityTypeEnum.AssignMember:
            return {
                icon: UserPlus,
                label: 'Assigned member',
                bgClass: 'bg-secondary-100',
                textClass: 'text-secondary-600',
            }
        case ActivityTypeEnum.UnassignMember:
            return {
                icon: UserMinus,
                label: 'Unassigned member',
                bgClass: 'bg-warning-100',
                textClass: 'text-warning-600',
            }
        case ActivityTypeEnum.ChangePaymentChannel:
            return {
                icon: CreditCard,
                label: 'Updated payment channel',
                bgClass: 'bg-default-100',
                textClass: 'text-default-600',
            }
        case ActivityTypeEnum.UpdateInformation:
            return {
                icon: Edit3,
                label: 'Updated details',
                bgClass: 'bg-blue-100',
                textClass: 'text-blue-600',
            }
        case ActivityTypeEnum.DeleteJob:
            return {
                icon: Trash2,
                label: 'Deleted job',
                bgClass: 'bg-danger-100',
                textClass: 'text-danger-600',
            }
        default:
            return {
                icon: Edit3,
                label: 'Updated job',
                bgClass: 'bg-default-100',
                textClass: 'text-default-600',
            }
    }
}
