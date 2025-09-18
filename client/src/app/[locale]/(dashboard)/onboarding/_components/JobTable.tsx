'use client'

import React, { useEffect, useState } from 'react'

import { addToast, Avatar, AvatarGroup, Button, Tooltip } from '@heroui/react'
import { Image, Table, Tooltip as TooltipAnt } from 'antd'
import type { TableColumnsType, TableProps } from 'antd'
import { Copy, EyeIcon, Link as LinkIcon } from 'lucide-react'

import { formatCurrencyVND } from '@/lib/formatCurrency'
import { uniqueByKey } from '@/lib/utils'
import { useConfirmModal } from '@/shared/components/ui/ConfirmModal'

import { useDetailModal } from '../@jobDetail/actions'
import { TJobVisibleColumn, useJobStore } from '../store/useJobStore'
import ActionDropdown from './ActionDropdown'
import CountDown from './CountDown'
import { useUsers } from '@/queries/useUser'
import { usePaymentChannels } from '@/queries/usePaymentChannel'
import { Job } from '@/types/job.type'
import { JobStatus } from '@/types/jobStatus.type'
import { useSettingStore } from '@/app/[locale]/settings/shared/store/useSettingStore'
import { DataType } from '../page'
import { Link } from '@/i18n/navigation'
import JobStatusDropdown from './JobStatusDropdown'
import { useAddMemberModal } from '../@addMember/actions'

type Props = {
    data: Job[]
    visibleColumns?: TJobVisibleColumn[]
    isLoading?: boolean
    pagination?: TableProps['pagination']
}
export default function JobTable({
    visibleColumns = ['income', 'clientName', 'jobName'],
    isLoading = false,
    data: jobsData,
    pagination = {
        position: ['bottomCenter'],
        pageSize: 10,
        current: 1,
        size: 'default',
    },
}: Props) {
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

    const handleCopyJob = (job: Job) => {
        navigator.clipboard
            .writeText(job.no)
            .then(() => {
                addToast({
                    title: 'Sao chép Job No thành công',
                    color: 'success',
                })
            })
            .catch((err) => {
                console.log(err)
                addToast({
                    title: 'Sao chép Job No thất bại',
                    color: 'danger',
                })
            })
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: (
                <p className="w-[60px] truncate" title="Thumbnail">
                    Thumbnail
                </p>
            ),
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            width: 60,
            render: (_, record: DataType) => {
                return (
                    <div className="flex items-center justify-center">
                        <div className="overflow-hidden rounded-full size-11">
                            <Image
                                src={record.status.thumbnailUrl}
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
            width: 100,
            sorter: {
                compare: (a, b) => a.clientName!.localeCompare(b.clientName!),
                multiple: 4,
            },
            // filters: uniqueByKey(jobs ?? [], 'clientName')?.map((item) => ({
            //     text: `${item.clientName}`,
            //     value: item?.clientName ?? '',
            // })),
            // onFilter: (value, record) =>
            //     record?.clientName?.indexOf(value as string) === 0,
        },
        {
            title: 'Job No.',
            dataIndex: 'jobNo',
            key: 'jobNo',
            width: 140,
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

                    <TooltipAnt placement="top" title="Copy link">
                        <LinkIcon
                            size={14}
                            strokeWidth={2}
                            className="hidden transition duration-150 group-hover:block"
                        />
                    </TooltipAnt>
                </div>
            ),
            sorter: {
                compare: (a, b) => a.no!.localeCompare(b.no!),
                multiple: 1,
            },
            // filters: uniqueByKey(jobTypes ?? [], 'code')?.map((item) => ({
            //     text: `${item.code}- ${item.name}`,
            //     value: item?.id ?? '',
            // })),
            // onFilter: (value, record) =>
            //     record?.jobTypeId?.toString().indexOf(value as string) === 0,
        },
        {
            title: 'Job Name',
            dataIndex: 'jobName',
            key: 'jobName',
            render: (jobName) => (
                <p className="font-semibold line-clamp-1">{jobName}</p>
            ),
            sorter: {
                compare: (a, b) => a.displayName.localeCompare(b.displayName),
                multiple: 3,
            },
        },
        {
            title: 'Income',
            dataIndex: 'income',
            key: 'income',
            width: '10%',
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
            width: '10%',
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
            title: (
                <p
                    className="text-nowrap w-[90px] truncate"
                    title="Payment Channel"
                >
                    Payment Channel
                </p>
            ),
            dataIndex: 'paymentChannel',
            key: 'paymentChannel',
            width: 90,
            render: (_, record: DataType) => (
                <p>{record.paymentChannel.displayName}</p>
            ),
            sorter: {
                compare: (a: DataType, b: DataType) =>
                    a.paymentChannel.displayName.localeCompare(
                        b.paymentChannel.displayName
                    ),
                multiple: 2,
            },
            filters: uniqueByKey(paymentChannels ?? [], 'name')?.map(
                (item) => ({
                    text: `${item.name}`,
                    value: item?.name ?? '',
                })
            ),
            onFilter: (value, record) =>
                record!.paymentChannel.displayName.indexOf(value as string) === 0,
        },
        {
            title: 'Due to',
            dataIndex: 'dueAt',
            key: 'dueAt',
            width: '10%',
            render: (_, record: DataType) => {
                return (
                    <div className="text-right">
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
            dataIndex: 'memberAssign',
            key: 'memberAssign',
            width: '10%',
            className: 'group cursor-default',
            render: (_, record: DataType) => {
                const show = 4
                return (
                    <>
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
                            <AvatarGroup
                                size="sm"
                                max={show}
                                total={record.assignee.length - show}
                                classNames={{
                                    base: 'max-w-full',
                                }}
                            >
                                {record.assignee.map((mem) => {
                                    return (
                                        <Tooltip
                                            key={mem.id}
                                            content={mem?.displayName}
                                            classNames={{
                                                content:
                                                    'max-w-fit text-nowrap',
                                            }}
                                            color="secondary"
                                        >
                                            <Avatar
                                                src={mem?.avatar ?? ''}
                                                classNames={{
                                                    base: 'data-[hover=true]:-translate-x-0 rtl:data-[hover=true]:translate-x-0 cursor-pointer',
                                                }}
                                                showFallback
                                            />
                                        </Tooltip>
                                    )
                                })}
                            </AvatarGroup>
                        )}
                    </>
                )
            },
            filters: uniqueByKey(users ?? [], 'id')?.map((item) => ({
                text: `${item.name}`,
                value: item?.id ?? '',
            })),
            onFilter: (value, record) =>
                record.assignee.some((item) => item.id === value),
        },
        {
            title: 'Status',
            dataIndex: 'jobStatus',
            key: 'jobStatus',
            width: 120,
            render: (_, record: DataType) => (
                <div className="flex items-center justify-center">
                    <JobStatusDropdown
                        jobData={record}
                        statusData={record?.status as JobStatus}
                    />
                </div>
            ),
            // filters: uniqueByKey(jobStatuses ?? [], 'id')?.map((item) => ({
            //     text: `${item.title}`,
            //     value: item?.id?.toString() ?? '',e
            // })),
            onFilter: (value, record) =>
                record?.status?.id?.toString()?.indexOf(value as string) === 0,
        },
        {
            title: 'Action',
            key: 'action',
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

    const newColumns = columns.map((item) => ({
        ...item,
        hidden: !visibleColumns.includes(item.key as keyof Job | 'action'),
    }))

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
    return (
        <Table<DataType>
            rowKey="no"
            columns={newColumns}
            onRow={(record) => {
                return {
                    className: `${record.no === newJobNo ? 'bg-yellow-200' : ''
                        } cursor-pointer`,
                    // onClick: () => {
                    //     const currentJobNo = record.no!

                    //     const foundIndex = selectedRowKeys.findIndex(
                    //         (i) => i.toString() === currentJobNo
                    //     )
                    //     if (foundIndex === -1) {
                    //         setSelectedRowKeys([
                    //             ...selectedRowKeys,
                    //             currentJobNo,
                    //         ])
                    //     } else {
                    //         setSelectedRowKeys(
                    //             selectedRowKeys.filter(
                    //                 (i) => i.toString() !== currentJobNo
                    //             )
                    //         )
                    //     }
                    // },
                }
            }}
            dataSource={dataSource}
            loading={isLoading}
            pagination={pagination}
            rowSelection={{
                selectedRowKeys,
                onChange: (newSelectedRowKeys: React.Key[]) =>
                    setSelectedRowKeys(newSelectedRowKeys),
            }}
            size={table.size as TableProps['size']}
            rowClassName="h-8! transition duration-500"
            showSorterTooltip
        />
    )
}
