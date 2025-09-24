'use client'

import React, { useEffect, useState } from 'react'

import { addToast, Button, Tooltip } from '@heroui/react'
import { Avatar, Image, Table } from 'antd'
import type { TableColumnsType, TableProps } from 'antd'
import {
    ChevronDown,
    ChevronsLeftRight,
    Copy,
    EyeIcon,
    ListFilter,
    ListFilterPlus,
} from 'lucide-react'

import { formatCurrencyVND } from '@/lib/formatCurrency'
import { useConfirmModal } from '@/shared/components/ui/ConfirmModal'

import { useDetailModal } from '../@jobDetail/actions'
import { useJobStore } from '../store/useJobStore'
import ActionDropdown from './ActionDropdown'
import CountDown from './CountDown'
import { useUsers } from '@/shared/queries/useUser'
import { usePaymentChannels } from '@/shared/queries/usePaymentChannel'
import { useSettingStore } from '@/app/[locale]/settings/shared/store/useSettingStore'
import { DataType } from '../page'
import { Link } from '@/i18n/navigation'
import JobStatusDropdown from './JobStatusDropdown'
import { useAddMemberModal } from '../@addMember/actions'
import { Job } from '@/shared/interfaces/job.interface'
import { JobStatus } from '@/shared/interfaces/jobStatus.interface'
import lodash from 'lodash'
import { IMAGE_CONSTANTS } from '@/shared/constants/image.constant'
import { useJobColumns } from '@/shared/queries/useJob'
import { JobColumn } from '@/shared/types/job.type'
import { useJobTypes } from '@/shared/queries/useJobType'
import PaidChip from '@/shared/components/customize/PaidChip'
import { VietnamDateFormat } from '@/lib/dayjs'
import { useJobStatuses } from '@/shared/queries/useJobStatus'
import { SortOrder } from 'antd/es/table/interface'
import CopyLink from './actions/CopyLink'
import envConfig from '../../../../../config/envConfig'

type TableColumns<DataType> = Array<
    Omit<TableColumnsType<DataType>[number], 'dataIndex'> & {
        dataIndex: JobColumn
    }
>
type Props = {
    data: Job[]
    isLoading?: boolean
}
export default function JobTable({
    data: jobsData,
    isLoading = false,
}: Props) {
    const { jobColumns: showColumns } = useJobColumns()
    /**
     * Define states
     */
    const [, setDeleteJob] = useState<Job | null>(null)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    /**
     * Instance hooks
     */
    const { openModal: openAddMemberModal } = useAddMemberModal()
    const deleteModal = useConfirmModal()
    const { newJobNo, setNewJobNo } = useJobStore()
    const { table } = useSettingStore()
    const { openModal } = useDetailModal()
    /**
     * Get initial data
     */
    const { data: users } = useUsers()
    const { data: paymentChannels } = usePaymentChannels()
    const { data: jobTypes } = useJobTypes()
    const { data: jobStatuses } = useJobStatuses()

    const handleCopyJob = (job: Job) => {
        navigator.clipboard
            .writeText(job.no)
            .then(() => {
                addToast({
                    title: 'Copy job no successful',
                    color: 'success',
                })
            })
            .catch((err) => {
                console.log(err)
                addToast({
                    title: 'Copy job no fail',
                    color: 'danger',
                })
            })
    }

    const dataColumns: TableColumns<DataType> = [
        {
            title: (
                <p className="w-[60px] truncate" title="Thumbnail">
                    Thumbnail
                </p>
            ),
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            fixed: 'left',
            width: 60,
            render: (_, record: DataType) => {
                const src =
                    record.status.thumbnailUrl ?? IMAGE_CONSTANTS.loading
                return (
                    <div className="flex items-center justify-center">
                        <div className="overflow-hidden rounded-full size-11">
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
            title: 'Client',
            dataIndex: 'clientName',
            key: 'clientName',
            minWidth: 120,
            render: (_, record) => (
                <p className="line-clamp-1">{record.clientName}</p>
            ),
            sorter: {
                compare: (a, b) => a.clientName!.localeCompare(b.clientName!),
                multiple: 4,
            },
            filters: lodash.uniqBy(jobsData, 'clientName')?.map((item) => ({
                text: `${item.clientName}`,
                value: item?.clientName ?? '',
            })),
            onFilter: (value, record) =>
                record?.clientName?.indexOf(value as string) === 0,
        },

        {
            title: 'Job Type',
            dataIndex: 'type',
            key: 'type',
            minWidth: 120,
            render: (_, record) => (
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
            title: 'Job No.',
            dataIndex: 'no',
            key: 'no',
            fixed: 'left',
            minWidth: 120,
            render: (jobNo) => (
                <div className="flex items-center justify-between gap-2 group size-full">
                    <Link
                        href={{
                            pathname: '/onboarding',
                            query: {
                                detail: jobNo,
                            },
                        }}
                        className="!text-foreground transition duration-150 hover:!underline uppercase line-clamp-1"
                    >
                        {jobNo}
                    </Link>

                    <CopyLink value={envConfig.NEXT_PUBLIC_URL + '/' + `onboarding?detail=${jobNo}`} />
                </div>
            ),
            sorter: {
                compare: (a, b) => a.no!.localeCompare(b.no!),
                multiple: 1,
            },
        },
        {
            title: 'Job Name',
            dataIndex: 'displayName',
            key: 'displayName',
            minWidth: 300,
            render: (displayName) => (
                <p className="font-semibold line-clamp-1" title={displayName}>
                    {displayName}
                </p>
            ),
            sorter: {
                compare: (a, b) => a.displayName.localeCompare(b.displayName),
                multiple: 3,
            },
        },
        {
            title: 'Income',
            dataIndex: 'incomeCost',
            key: 'incomeCost',
            minWidth: 130,
            render: () => (
                <p className="font-semibold text-right text-red-500">$ 10</p>
            ),
            sorter: {
                compare: (a, b) => a.incomeCost - b.incomeCost,
                multiple: 2,
            },
        },
        {
            title: 'Staff Cost',
            dataIndex: 'staffCost',
            key: 'staffCost',
            minWidth: 130,
            render: (staffCost) => (
                <p className="font-semibold text-right text-red-500">
                    {formatCurrencyVND(staffCost)}
                </p>
            ),
            sorter: {
                compare: (a, b) => a.staffCost - b.staffCost,
                multiple: 2,
            },
        },
        {
            title: 'Payment Channel',
            dataIndex: 'paymentChannel',
            key: 'paymentChannel',
            minWidth: 200,
            render: (_, record: DataType) => (
                <p className="line-clamp-1">
                    {record.paymentChannel.displayName}
                </p>
            ),
            sorter: {
                compare: (a: DataType, b: DataType) =>
                    a.paymentChannel.displayName.localeCompare(
                        b.paymentChannel.displayName
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
            title: 'Attachments',
            dataIndex: 'attachmentUrls',
            key: 'attachmentUrls',
            minWidth: 140,
            render: (_, record) => (
                <div>
                    {!record.attachmentUrls ||
                        record.attachmentUrls.length === 0 ? (
                        <p></p>
                    ) : (
                        <p>{record.attachmentUrls.length} attachments</p>
                    )}
                </div>
            ),
        },
        {
            title: 'Due to',
            dataIndex: 'dueAt',
            key: 'dueAt',
            minWidth: 170,
            render: (_, record: DataType) => {
                return (
                    <div className="text-right line-clamp-1">
                        <CountDown
                            endedDate={record.dueAt!}
                            options={{
                                format: 'short',
                                showYears: true,
                                showMonths: true,
                                showDays: true,
                                showHours: true,
                                showMinutes: true,
                                showSeconds: true,
                            }}
                        />
                    </div>
                )
            },
        },
        {
            title: 'Assignee',
            dataIndex: 'assignee',
            key: 'assignee',
            minWidth: 150,
            className: 'group cursor-default',
            render: (_, record: DataType) => {
                const count = 4
                return (
                    <div
                        onClick={() => {
                            openAddMemberModal(record.no)
                        }}
                        className="cursor-pointer w-fit"
                        title="View assignee"
                    >
                        {record.assignee.length === 0 ? (
                            <button
                                onClick={() =>
                                    openAddMemberModal(record.no as string)
                                }
                                className="text-blue-600 transition duration-150 opacity-0 cursor-pointer group-hover:opacity-100 hover:underline underline-offset-2"
                            >
                                Add assignee
                            </button>
                        ) : (
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
            title: 'Payment Status',
            dataIndex: 'isPaid',
            key: 'isPaid',
            width: 120,
            className: 'group cursor-default',
            render: (_, record: DataType) => {
                return (
                    <PaidChip
                        status={record.isPaid ? 'paid' : 'unpaid'}
                        classNames={{
                            base: 'w-full',
                        }}
                    />
                )
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (_, record: DataType) => (
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
            title: 'Completed at',
            dataIndex: 'completedAt',
            key: 'completedAt',
            minWidth: 120,
            render: (_, record: DataType) => (
                <div>
                    {record?.completedAt &&
                        VietnamDateFormat(record.completedAt)}
                </div>
            ),
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            key: 'createdAt',
            minWidth: 100,
            render: (_, record: DataType) => (
                <div>
                    {record?.createdAt && VietnamDateFormat(record.createdAt)}
                </div>
            ),
        },
        {
            title: 'Last modify',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            minWidth: 100,
            render: (_, record: DataType) => (
                <div>
                    {record?.updatedAt && VietnamDateFormat(record.updatedAt)}
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record: DataType) => {
                return (
                    <div className="flex items-center justify-end gap-2">
                        <Tooltip content="View detail">
                            <Button
                                variant="light"
                                color="primary"
                                onPress={() => openModal(record.no!)}
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
                        <Tooltip content="Copy Job No.">
                            <Button
                                variant="light"
                                color="primary"
                                onPress={() => handleCopyJob(record)}
                                className="flex items-center justify-center"
                                size="sm"
                                isIconOnly
                            >
                                <Copy size={18} className="text-text-fore2" />
                            </Button>
                        </Tooltip>
                        <ActionDropdown
                            data={record}
                            setDeleteJob={setDeleteJob}
                            onOpen={deleteModal.onOpen}
                        />
                    </div>
                )
            },
        },
    ]

    // Remove hight after 1 second
    useEffect(() => {
        if (newJobNo) {
            const timeout = setTimeout(() => {
                setNewJobNo(null)
            }, 800)

            return () => clearTimeout(timeout)
        }
    }, [newJobNo])

    const dataSource = jobsData?.map((prj, index) => ({
        ...prj,
        key: prj?.id ?? index,
    }))

    const finalColumns = dataColumns.map((item) => ({
        ...item,
        hidden: !showColumns?.includes(item.key as JobColumn),
        filterIcon: (filtered: boolean) => {
            return <>
                {!filtered ? <ListFilterPlus size={14} className='text-text2 transition duration-100' /> : <ListFilter size={14} className='text-primary transition duration-100' />}
            </>
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
    return (
        <Table<DataType>
            rowKey="no"
            columns={finalColumns}
            onRow={(record) => {
                return {
                    className: `${record.no === newJobNo ? 'bg-yellow-200' : ''
                        } cursor-pointer`,
                }
            }}
            dataSource={dataSource}
            loading={isLoading}
            rowSelection={{
                selectedRowKeys,
                onChange: (newSelectedRowKeys: React.Key[]) =>
                    setSelectedRowKeys(newSelectedRowKeys),
            }}
            pagination={false}
            size={table.size as TableProps['size']}
            rowClassName="transition duration-500"
            scroll={{ x: 'max-content', y: 61 * 8 + 20 }}
            style={{
                minHeight: 61 * 8 + 20
            }}
        />
    )
}
