import { Link } from '@/i18n/navigation'
import { VietnamDateFormat } from '@/lib/dayjs'
import { formatCurrencyVND } from '@/lib/formatCurrency'
import {
    CopyButton,
    handleCopy,
    JobStatusDropdown,
    PaidChip,
} from '@/shared/components'
import { envConfig } from '@/shared/config'
import { IMAGE_CONSTANTS } from '@/shared/constants'
import { DefaultJobStatusCode } from '@/shared/enums'
import {
    Job,
    JobStatus,
    JobType,
    PaymentChannel,
    User,
} from '@/shared/interfaces'
import { JobColumn } from '@/shared/types'
import { addToast, Button, Tooltip } from '@heroui/react'
import { Avatar, Image, TableColumnsType } from 'antd'
import { SortOrder } from 'antd/es/table/interface'
import lodash from 'lodash'
import {
    ChevronDown,
    ChevronsLeftRight,
    EyeIcon,
    ListFilter,
    ListFilterPlus,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { DueToField, SwitchCurrency, TableActionDropdown } from '../components'
import { JobFilterParams } from '../../page'

export type JobWithKey = Job & {
    key: React.Key
}

type TableColumns<DataType> = Array<
    Omit<TableColumnsType<DataType>[number], 'dataIndex'> & {
        dataIndex: JobColumn
    }
>

export function jobColumns(
    data: {
        jobs: Job[]
        jobStatuses: JobStatus[]
        users: User[]
        jobTypes: JobType[]
        paymentChannels: PaymentChannel[]
    },
    actions: {
        onAssignMember?: (jobNo: string) => void
        onViewDetail?: (jobNo: string) => void
    },
    options: {
        filterValue?: JobFilterParams
        locale?: string
        showColumns?: string[]
        translations: ReturnType<typeof useTranslations>
    }
): TableColumns<JobWithKey> {
    const { jobs, jobStatuses, users, jobTypes, paymentChannels } = data
    const { onAssignMember, onViewDetail } = actions
    const { locale = 'en', showColumns, translations, filterValue } = options

    const allColumns: TableColumns<JobWithKey> = [
        {
            title: (
                <p
                    className="truncate text-text1"
                    title={translations('jobColumns.thumbnail')}
                >
                    {translations('jobColumns.thumbnail')}
                </p>
            ),
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            fixed: 'left',
            width: 44,
            render: (_: unknown, record: JobWithKey) => {
                const src =
                    record.status.thumbnailUrl ?? IMAGE_CONSTANTS.loading
                return (
                    <div className="flex items-center justify-center">
                        <div className="overflow-hidden rounded-full size-10">
                            <Image
                                src={src}
                                alt="image"
                                className="object-cover rounded-full size-full"
                                preview={false}
                            />
                        </div>
                    </div>
                )
            },
        },
        {
            title: translations('jobColumns.clientName'),
            dataIndex: 'clientName',
            key: 'clientName',
            minWidth: 120,
            render: (_: unknown, record: JobWithKey) => (
                <p className="line-clamp-1">{record.clientName}</p>
            ),
            sorter: { multiple: 1 },
            filterSearch: true,
            filters: lodash.uniqBy(jobs, 'clientName')?.map((item) => ({
                text: item.clientName,
                value: item.clientName ?? '',
            })),
        },
        {
            title: translations('jobColumns.type'),
            dataIndex: 'type',
            key: 'type',
            minWidth: 120,
            filterSearch: true,
            filters: lodash.uniqBy(jobTypes, 'code')?.map((item) => ({
                text: item.displayName,
                value: item.code ?? '',
            })),
            // filteredValue: filterValue?.type ? filterValue?.type : [],
            render: (_: unknown, record: JobWithKey) => (
                <p className="line-clamp-1">{record.type.displayName}</p>
            ),
        },
        {
            title: translations('jobColumns.no'),
            dataIndex: 'no',
            key: 'no',
            fixed: 'left',
            minWidth: 120,
            sorter: { multiple: 1 },
            render: (jobNo) => (
                <div className="flex items-center justify-between gap-2 group size-full">
                    <p
                        className="!text-text1 link uppercase hover:medium"
                        onClick={() =>
                            handleCopy(jobNo, () => {
                                addToast({
                                    title: translations('copiedToClipboard'),
                                    color: 'success',
                                })
                            })
                        }
                    >
                        {jobNo}
                    </p>
                </div>
            ),
        },
        {
            title: translations('jobColumns.displayName'),
            dataIndex: 'displayName',
            key: 'displayName',
            minWidth: 300,
            sorter: { multiple: 1 },
            render: (displayName, record: JobWithKey) => (
                <button className="link">
                    <Link
                        href={`/project-center/${record?.no}`}
                        title={displayName}
                        className="!text-text1 link font-semibold line-clamp-1"
                    >
                        {displayName}
                    </Link>
                </button>
            ),
        },
        {
            title: translations('jobColumns.incomeCost'),
            dataIndex: 'incomeCost',
            key: 'incomeCost',
            minWidth: 100,
            sorter: { multiple: 1 },
            render: (incomeCost) => (
                <SwitchCurrency value={incomeCost} defaultType="en" />
            ),
        },
        {
            title: translations('jobColumns.staffCost'),
            dataIndex: 'staffCost',
            key: 'staffCost',
            minWidth: 100,
            sorter: { multiple: 1 },
            render: (staffCost) => (
                <p className="font-bold text-right text-currency">
                    {formatCurrencyVND(staffCost)}
                </p>
            ),
        },
        {
            title: translations('jobColumns.status'),
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (_, record: JobWithKey) => (
                <div className="flex items-center justify-center z-0">
                    <JobStatusDropdown
                        jobData={record}
                        statusData={record.status as JobStatus}
                    />
                </div>
            ),
            filters: lodash.uniqBy(jobStatuses, 'code')?.map((item) => ({
                text: item.displayName,
                value: item.code?.toString() ?? '',
            })),
        },
        {
            title: translations('jobColumns.dueAt'),
            dataIndex: 'dueAt',
            key: 'dueAt',
            minWidth: 170,
            sorter: { multiple: 1 },
            render: (_, record: JobWithKey) => (
                <div className="text-right line-clamp-1">
                    <DueToField
                        data={record.dueAt}
                        disableCountdown={
                            record.status.code ===
                                DefaultJobStatusCode.FINISH ||
                            record.status.code ===
                                DefaultJobStatusCode.COMPLETED
                        }
                    />
                </div>
            ),
        },
        {
            title: translations('jobColumns.attachmentUrls'),
            dataIndex: 'attachmentUrls',
            key: 'attachmentUrls',
            minWidth: 100,
            render: (_, record: JobWithKey) =>
                !record.attachmentUrls?.length ? (
                    <p>-</p>
                ) : (
                    <p>{record.attachmentUrls.length} attachments</p>
                ),
        },
        {
            title: translations('jobColumns.assignee'),
            dataIndex: 'assignee',
            key: 'assignee',
            minWidth: 150,
            className: 'group cursor-default',
            filterSearch: true,
            filters: lodash.uniqBy(users, 'username').map((item) => ({
                text: item.displayName,
                value: item.username ?? '',
            })),
            render: (_, record: JobWithKey) => {
                const count = 4
                return (
                    <div
                        onClick={() => {
                            onAssignMember?.(record.no)
                        }}
                        className="cursor-pointer w-fit"
                    >
                        {!record.assignee.length ? (
                            <button
                                onClick={() => onAssignMember?.(record.no)}
                                className="link"
                                title={translations('assignMembers')}
                            >
                                {translations('assignMembers')}
                            </button>
                        ) : (
                            <Avatar.Group
                                max={{
                                    count,
                                    style: {
                                        color: 'var(--color-primary)',
                                        backgroundColor:
                                            'var(--color-primary-50)',
                                    },
                                    popover: {
                                        styles: {
                                            body: { borderRadius: '16px' },
                                        },
                                    },
                                }}
                            >
                                {record.assignee.map((member) => (
                                    <Avatar
                                        key={member.id}
                                        src={member.avatar}
                                    />
                                ))}
                            </Avatar.Group>
                        )}
                    </div>
                )
            },
        },
        {
            title: translations('jobColumns.isPaid'),
            dataIndex: 'isPaid',
            key: 'isPaid',
            width: 120,
            className: 'group cursor-default',
            render: (_, record: JobWithKey) => (
                <PaidChip
                    status={record.isPaid ? 'paid' : 'unpaid'}
                    classNames={{
                        base: '!w-[100px]',
                        content: '!w-[100px] text-center',
                    }}
                />
            ),
        },
        {
            title: translations('jobColumns.paymentChannel'),
            dataIndex: 'paymentChannel',
            key: 'paymentChannel',
            minWidth: 200,
            filters: lodash
                .uniqBy(paymentChannels, 'displayName')
                .map((item) => ({
                    text: item.displayName,
                    value: item.displayName ?? '',
                })),
            render: (_, record: JobWithKey) =>
                record.paymentChannel ? (
                    <p className="line-clamp-1">
                        {record.paymentChannel.displayName}
                    </p>
                ) : (
                    <p>-</p>
                ),
        },
        {
            title: translations('jobColumns.completedAt'),
            dataIndex: 'completedAt',
            key: 'completedAt',
            minWidth: 120,
            sorter: { multiple: 1 },
            render: (_, record: JobWithKey) =>
                record.completedAt
                    ? VietnamDateFormat(record.completedAt)
                    : '-',
        },
        {
            title: translations('jobColumns.createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            minWidth: 100,
            sorter: { multiple: 1 },
            render: (_, record: JobWithKey) =>
                record.createdAt && VietnamDateFormat(record.createdAt),
        },
        {
            title: translations('jobColumns.updatedAt'),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            minWidth: 100,
            sorter: { multiple: 1 },
            render: (_, record: JobWithKey) =>
                record.updatedAt && VietnamDateFormat(record.updatedAt),
        },
        {
            title: translations('jobColumns.action'),
            key: 'action',
            dataIndex: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record: JobWithKey) => (
                <div className="flex items-center justify-end gap-2">
                    {onViewDetail && (
                        <Tooltip content={translations('viewDetail')}>
                            <Button
                                variant="light"
                                color="primary"
                                onPress={() => onViewDetail?.(record.no)}
                                size="sm"
                                isIconOnly
                            >
                                <EyeIcon
                                    size={18}
                                    className="text-text-fore2"
                                />
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip content={translations('copyLink')}>
                        <CopyButton
                            slot="p"
                            content={`${envConfig.NEXT_PUBLIC_URL}/${locale}/project-center?detail=${record.no}`}
                            variant="ghost"
                        />
                    </Tooltip>
                    <TableActionDropdown data={record} />
                </div>
            ),
        },
    ]

    if (showColumns && showColumns.length > 0) {
        return allColumns.map((item) => ({
            ...item,
            hidden: !showColumns?.includes(item.key as JobColumn),
            filterIcon: (filtered: boolean) => {
                return (
                    <>
                        {!filtered ? (
                            <ListFilterPlus
                                size={14}
                                className="text-text2 transition duration-100"
                            />
                        ) : (
                            <ListFilter
                                size={14}
                                className="text-primary transition duration-100"
                            />
                        )}
                    </>
                )
            },
            sortIcon: (props: { sortOrder: SortOrder }) => {
                const { sortOrder } = props
                return (
                    <>
                        {sortOrder ? (
                            <ChevronDown
                                size={14}
                                className="transition duration-150 text-text2"
                                style={{
                                    transform:
                                        sortOrder === 'ascend'
                                            ? 'rotate(0deg)'
                                            : 'rotate(180deg)',
                                }}
                            />
                        ) : (
                            <ChevronsLeftRight
                                size={14}
                                className="rotate-90 text-text2"
                            />
                        )}
                    </>
                )
            },
        }))
    }
    return allColumns
}
