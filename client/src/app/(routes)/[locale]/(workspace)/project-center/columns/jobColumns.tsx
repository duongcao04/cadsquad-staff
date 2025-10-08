import envConfig from '@/config/envConfig'
import { Link } from '@/i18n/navigation'
import { VietnamDateFormat } from '@/lib/dayjs'
import { formatCurrencyVND } from '@/lib/formatCurrency'
import PaidChip from '@/shared/components/chips/PaidChip'
import JobStatusDropdown from '@/shared/components/dropdowns/JobStatusDropdown'
import { IMAGE_CONSTANTS } from '@/shared/constants/image.constant'
import { Job } from '@/shared/interfaces/job.interface'
import { JobStatus } from '@/shared/interfaces/jobStatus.interface'
import { JobType } from '@/shared/interfaces/jobType.interface'
import { PaymentChannel } from '@/shared/interfaces/paymentChannel.interface'
import { User } from '@/shared/interfaces/user.interface'
import { JobColumn } from '@/shared/types/job.type'
import { addToast, Button, Tooltip } from '@heroui/react'
import { Avatar, Image, TableColumnsType } from 'antd'
import lodash from 'lodash'
import {
    ChevronDown,
    ChevronsLeftRight,
    EyeIcon,
    ListFilter,
    ListFilterPlus,
} from 'lucide-react'
import ActionDropdown from '../components/ActionDropdown'
import SwitchCurrency from '../components/SwitchCurrency'
import { SortOrder } from 'antd/es/table/interface'
import { CopyButton, handleCopy } from '@/shared/components/ui/copy-button'
import DueToField from '../components/data-fields/DueToField'
import { DefaultJobStatusCode } from '@/shared/enums/default-job-status-code.enum'
import { useTranslations } from 'next-intl'

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
    handler: {
        onAssignMember?: (jobNo: string) => void
        onViewDetail?: (jobNo: string) => void
        onDeleteJob?: (jobNo: string) => void
    },
    options: {
        locale?: string
        showColumns?: string[]
        translations: ReturnType<typeof useTranslations>
    }
): TableColumns<JobWithKey> {
    const { jobs, jobStatuses, users, jobTypes, paymentChannels } = data
    const { onAssignMember, onViewDetail, onDeleteJob } = handler
    const { locale = 'en', showColumns, translations } = options

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
            sorter: {
                compare: (a: JobWithKey, b: JobWithKey) =>
                    a.clientName!.localeCompare(b.clientName!),
                multiple: 4,
            },
            filters: lodash.uniqBy(jobs, 'clientName')?.map((item) => ({
                text: `${item.clientName}`,
                value: item?.clientName ?? '',
            })),
            onFilter: (value, record) =>
                record?.clientName?.indexOf(value as string) === 0,
        },
        {
            title: translations('jobColumns.type'),
            dataIndex: 'type',
            key: 'type',
            minWidth: 120,
            render: (_: unknown, record: JobWithKey) => (
                <p className="line-clamp-1">{record.type.displayName}</p>
            ),
            sorter: {
                compare: (a, b) => a.no!.localeCompare(b.no!),
                multiple: 1,
            },
            filters: lodash.uniqBy(jobTypes, 'code')?.map((item) => ({
                text: item.displayName,
                value: item?.id ?? '',
            })),
            onFilter: (value, record) =>
                record.type.id.toString().indexOf(value as string) === 0,
        },
        {
            title: (
                <p className="truncate" title={translations('jobColumns.no')}>
                    {translations('jobColumns.no')}
                </p>
            ),
            dataIndex: 'no',
            key: 'no',
            fixed: 'left',
            minWidth: 120,
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
            sorter: {
                compare: (a, b) => a.no!.localeCompare(b.no!),
                multiple: 1,
            },
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('jobColumns.displayName')}
                >
                    {translations('jobColumns.displayName')}
                </p>
            ),
            dataIndex: 'displayName',
            key: 'displayName',
            minWidth: 300,
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
            sorter: {
                compare: (a, b) => a.displayName.localeCompare(b.displayName),
                multiple: 3,
            },
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('jobColumns.incomeCost')}
                >
                    {translations('jobColumns.incomeCost')}
                </p>
            ),
            dataIndex: 'incomeCost',
            key: 'incomeCost',
            minWidth: 100,
            render: (incomeCost) => (
                <SwitchCurrency value={incomeCost} defaultType="en" />
            ),
            sorter: {
                compare: (a, b) => a.incomeCost - b.incomeCost,
                multiple: 2,
            },
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('jobColumns.staffCost')}
                >
                    {translations('jobColumns.staffCost')}
                </p>
            ),
            dataIndex: 'staffCost',
            key: 'staffCost',
            minWidth: 100,
            render: (staffCost) => (
                <p className="font-bold text-right text-currency">
                    {formatCurrencyVND(staffCost)}
                </p>
            ),
            sorter: {
                compare: (a, b) => a.staffCost - b.staffCost,
                multiple: 2,
            },
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('jobColumns.status')}
                >
                    {translations('jobColumns.status')}
                </p>
            ),
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
            filters: lodash.uniqBy(jobStatuses, 'id')?.map((item) => ({
                text: `${item.displayName}`,
                value: item?.id?.toString() ?? '',
            })),
            onFilter: (value, record) =>
                record?.status?.id?.toString()?.indexOf(value as string) === 0,
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('jobColumns.dueAt')}
                >
                    {translations('jobColumns.dueAt')}
                </p>
            ),
            dataIndex: 'dueAt',
            key: 'dueAt',
            minWidth: 170,
            render: (_, record: JobWithKey) => {
                return (
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
                )
            },
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('jobColumns.attachmentUrls')}
                >
                    {translations('jobColumns.attachmentUrls')}
                </p>
            ),
            dataIndex: 'attachmentUrls',
            key: 'attachmentUrls',
            minWidth: 100,
            render: (_: unknown, record: JobWithKey) => (
                <div>
                    {!record.attachmentUrls ||
                    record.attachmentUrls.length === 0 ? (
                        <p>-</p>
                    ) : (
                        <p>{record.attachmentUrls.length} attachments</p>
                    )}
                </div>
            ),
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('jobColumns.assignee')}
                >
                    {translations('jobColumns.assignee')}
                </p>
            ),
            dataIndex: 'assignee',
            key: 'assignee',
            minWidth: 150,
            className: 'group cursor-default',
            render: (_, record: JobWithKey) => {
                const count = 4
                return (
                    <div
                        onClick={() => {
                            onAssignMember?.(record.no)
                        }}
                        className="cursor-pointer w-fit"
                    >
                        {record.assignee.length === 0 ? (
                            <button
                                onClick={() => {
                                    onAssignMember?.(record.no)
                                }}
                                className="link"
                                title={translations('assignMembers')}
                            >
                                {translations('assignMembers')}
                            </button>
                        ) : (
                            <div title={translations('jobColumns.assignee')}>
                                <Avatar.Group
                                    max={{
                                        count: count,
                                        style: {
                                            color: 'var(--color-primary)',
                                            backgroundColor:
                                                'var(--color-primary-50)',
                                        },
                                        popover: {
                                            styles: {
                                                body: {
                                                    borderRadius: '16px',
                                                },
                                            },
                                        },
                                    }}
                                >
                                    {record.assignee.map((member) => {
                                        return (
                                            <Avatar
                                                key={member.id}
                                                src={member.avatar}
                                            />
                                        )
                                    })}
                                </Avatar.Group>
                            </div>
                        )}
                    </div>
                )
            },
            filters: lodash.uniqBy(users, 'id').map((item) => ({
                text: `${item.displayName}`,
                value: item.id ?? '',
            })),
            onFilter: (value, record) =>
                record.assignee.some((item) => item.id === value),
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('jobColumns.isPaid')}
                >
                    {translations('jobColumns.isPaid')}
                </p>
            ),
            dataIndex: 'isPaid',
            key: 'isPaid',
            width: 120,
            className: 'group cursor-default',
            render: (_, record: JobWithKey) => {
                return (
                    <PaidChip
                        status={record.isPaid ? 'paid' : 'unpaid'}
                        classNames={{
                            base: '!w-[100px]',
                            content: '!w-[100px] text-center',
                        }}
                    />
                )
            },
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('jobColumns.paymentChannel')}
                >
                    {translations('jobColumns.paymentChannel')}
                </p>
            ),
            dataIndex: 'paymentChannel',
            key: 'paymentChannel',
            minWidth: 200,
            render: (_, record: JobWithKey) => (
                <p className="line-clamp-1">
                    {record?.paymentChannel
                        ? record.paymentChannel?.displayName
                        : '-'}
                </p>
            ),
            sorter: {
                compare: (a: JobWithKey, b: JobWithKey) =>
                    a.paymentChannel?.displayName.localeCompare(
                        b.paymentChannel?.displayName
                    ),
                multiple: 2,
            },
            filters: lodash
                .uniqBy(paymentChannels, 'displayName')
                .map((item) => ({
                    text: `${item.displayName}`,
                    value: item.displayName ?? '',
                })),
            onFilter: (value, record) =>
                record.paymentChannel.displayName.indexOf(value as string) ===
                0,
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('jobColumns.completedAt')}
                >
                    {translations('jobColumns.completedAt')}
                </p>
            ),
            dataIndex: 'completedAt',
            key: 'completedAt',
            minWidth: 120,
            render: (_, record: JobWithKey) => (
                <div>
                    {record?.completedAt
                        ? VietnamDateFormat(record.completedAt)
                        : '-'}
                </div>
            ),
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('jobColumns.createdAt')}
                >
                    {translations('jobColumns.createdAt')}
                </p>
            ),
            dataIndex: 'createdAt',
            key: 'createdAt',
            minWidth: 100,
            render: (_, record: JobWithKey) => (
                <div>
                    {record?.createdAt && VietnamDateFormat(record.createdAt)}
                </div>
            ),
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('jobColumns.updatedAt')}
                >
                    {translations('jobColumns.updatedAt')}
                </p>
            ),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            minWidth: 100,
            render: (_, record: JobWithKey) => (
                <div>
                    {record?.updatedAt && VietnamDateFormat(record.updatedAt)}
                </div>
            ),
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('jobColumns.action')}
                >
                    {translations('jobColumns.action')}
                </p>
            ),
            key: 'action',
            dataIndex: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record: JobWithKey) => {
                return (
                    <div className="flex items-center justify-end gap-2">
                        <Tooltip content={translations('viewDetail')}>
                            <Button
                                variant="light"
                                color="primary"
                                onPress={() => {
                                    onViewDetail?.(record.no)
                                }}
                                className="flex items-center justify-center"
                                size="sm"
                                isIconOnly
                            >
                                <EyeIcon
                                    size={18}
                                    className="text-text-fore2"
                                />
                            </Button>
                        </Tooltip>
                        <Tooltip content={translations('copyLink')}>
                            <CopyButton
                                slot="p"
                                content={
                                    envConfig.NEXT_PUBLIC_URL +
                                    `/${locale}/` +
                                    `project-center?detail=${record.no}`
                                }
                                variant="ghost"
                            />
                        </Tooltip>
                        <ActionDropdown
                            data={record}
                            onDeleteJob={() => {
                                onDeleteJob?.(record.no)
                            }}
                        />
                    </div>
                )
            },
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
