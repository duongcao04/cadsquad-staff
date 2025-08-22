'use client'

import React from 'react'
import { useJobs } from '@/queries/useJob'
import { Image, Table, TableColumnsType, Tag } from 'antd'
import { DataType } from '../../onboarding/page'
import { Avatar, AvatarGroup, Chip, Tooltip } from '@heroui/react'
import { formatCurrencyVND } from '@/lib/formatCurrency'
import CountDown from '../../onboarding/_components/CountDown'
import { Job } from '@/validationSchemas/job.schema'

type Props = {
    onAddTab: (record: Job) => void
}
export default function WorkbenchTable({ onAddTab }: Props) {
    /**
     * Get initial data
     */
    const {
        jobs,
        isLoading: loadingJobs,
        meta,
    } = useJobs({
        tab: 'active',
    })
    const columns: TableColumnsType<DataType> = [
        {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            width: 100,
            render: (_, record: DataType) => {
                return (
                    <div className="size-11 rounded-full overflow-hidden flex items-center justify-center">
                        <Image
                            src={record?.jobStatus?.thumbnail}
                            alt="image"
                            className="size-full object-cover rounded-full"
                            preview={false}
                        />
                    </div>
                )
            },
            hidden: true,
        },
        {
            title: 'Client',
            dataIndex: 'clientName',
            key: 'clientName',
            width: '10%',
            sorter: {
                compare: (a, b) => a.clientName!.localeCompare(b.clientName!),
                multiple: 4,
            },
        },
        {
            title: 'Job No.',
            dataIndex: 'jobNo',
            key: 'jobNo',
            width: '10%',
            sorter: {
                compare: (a, b) => a.jobNo!.localeCompare(b.jobNo!),
                multiple: 1,
            },
        },
        {
            title: 'Job Name',
            dataIndex: 'jobName',
            key: 'jobName',
            render: (jobName) => (
                <p className="font-semibold uppercase line-clamp-1">
                    {jobName}
                </p>
            ),
            sorter: {
                compare: (a, b) => a.jobName!.localeCompare(b.jobName!),
                multiple: 3,
            },
        },
        {
            title: 'Income',
            dataIndex: 'income',
            key: 'income',
            width: '10%',
            render: () => <p className="font-semibold text-red-500">$ 10</p>,
            sorter: {
                compare: (a, b) => a.income! - b.income!,
                multiple: 2,
            },
            hidden: true,
        },
        {
            title: 'Staff Cost',
            dataIndex: 'staffCost',
            key: 'staffCost',
            width: '10%',
            render: (staffCost) => (
                <p className="font-semibold text-red-500">
                    {formatCurrencyVND(staffCost)}
                </p>
            ),
            sorter: {
                compare: (a, b) => a.staffCost! - b.staffCost!,
                multiple: 2,
            },
        },
        {
            title: 'Payment Channel',
            dataIndex: 'paymentChannel',
            key: 'paymentChannel',
            width: '10%',
            render: (_, record: DataType) => (
                <p>{record.paymentChannel.name}</p>
            ),
            sorter: {
                compare: (a: DataType, b: DataType) =>
                    a.paymentChannel.name!.localeCompare(
                        b.paymentChannel.name!
                    ),
                multiple: 2,
            },
        },
        {
            title: 'Due to',
            dataIndex: 'dueAt',
            key: 'dueAt',
            width: '10%',
            render: (_, record: DataType) => {
                return (
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
                )
            },
        },
        {
            title: 'Assignee',
            dataIndex: 'memberAssign',
            key: 'memberAssign',
            width: '10%',
            render: (_, record: DataType) => {
                const show = 4
                return (
                    <AvatarGroup
                        size="sm"
                        max={show}
                        total={record?.memberAssign?.length - show}
                        classNames={{
                            base: 'max-w-full',
                        }}
                    >
                        {record.memberAssign.map((mem) => {
                            return (
                                <Tooltip
                                    key={mem.id}
                                    content={mem?.name}
                                    classNames={{
                                        content: 'max-w-fit text-nowrap',
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
                )
            },
        },
        {
            title: 'Status',
            dataIndex: 'jobStatus',
            key: 'jobStatus',
            width: 140,
            render: (_, record: DataType) => (
                <Tag color={record?.jobStatus.color}>
                    {record?.jobStatus.title}
                </Tag>
            ),
        },
    ]
    return (
        <Table<DataType>
            rowKey="jobNo"
            columns={columns}
            onHeaderRow={() => {
                return {
                    style: {
                        background: 'var(--color-text4)',
                    },
                }
            }}
            onRow={(record) => {
                return {
                    className: 'cursor-pointer',
                    title: 'Double click to view',
                    onDoubleClick: () => onAddTab(record),
                }
            }}
            dataSource={jobs?.map((prj, index) => ({
                ...prj,
                key: prj?.id ?? index,
            }))}
            loading={loadingJobs}
            pagination={{
                position: ['bottomCenter'],
                pageSize: meta?.limit,
                current: meta?.page,
                size: 'default',
                total: meta?.total,
            }}
            size="middle"
            rowClassName="h-8! transition duration-500"
            showSorterTooltip
        />
    )
}
