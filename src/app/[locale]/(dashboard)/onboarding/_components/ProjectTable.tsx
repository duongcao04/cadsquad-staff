'use client'

import React, { useState } from 'react'

import {
    Avatar,
    AvatarGroup,
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Tooltip,
} from '@heroui/react'
import { SharedSelection } from '@heroui/react'
import { Image, Table } from 'antd'
import type { TableProps } from 'antd'
import { Badge, Tabs, TabsProps } from 'antd'
import { Input } from 'antd'
import {
    ArrowLeftRight,
    EllipsisVerticalIcon,
    EyeIcon,
    Trash,
} from 'lucide-react'
import { ChevronDownIcon, Search } from 'lucide-react'
import useSWR, { mutate } from 'swr'

import { formatCurrencyVND } from '@/lib/formatCurrency'
import { getJobStatuses, updateJobStatus } from '@/lib/swr/actions/jobStatus'
import { getJobTypes } from '@/lib/swr/actions/jobTypes'
import { getPaymentChannels } from '@/lib/swr/actions/paymentChannels'
import { getProjects } from '@/lib/swr/actions/project'
import { getUsers } from '@/lib/swr/actions/user'
import {
    JOB_STATUS_API,
    JOB_TYPE_API,
    PAYMENT_CHANNEL_API,
    PROJECT_API,
    USER_API,
} from '@/lib/swr/api'
import { uniqueByKey } from '@/lib/utils'
import { capitalize } from '@/lib/utils'
import { useUserOptionsStore } from '@/shared/components/FileManager/store/useUserOptionsStore'
import { useSearchParam } from '@/shared/hooks/useSearchParam'
import { JobStatus, Project } from '@/validationSchemas/project.schema'

import { useDetailModal } from '../@detail/actions'
import CountDown from './CountDown'

const DEFAULT_TAB = 'priority'

type DataType = Project & {
    key: React.Key
}

export default function ProjectTable() {
    const [keywords, setKeywords] = useState('')

    const { projectTable, setProjectTable } = useUserOptionsStore()
    const { openModal } = useDetailModal()

    const { getSearchParam, setSearchParams, removeSearchParam } =
        useSearchParam()
    const statusFilter = getSearchParam('tab')
    const tabValue = getSearchParam('tab') ?? DEFAULT_TAB

    const { data: users } = useSWR(USER_API, getUsers)
    const { data: jobTypes } = useSWR(JOB_TYPE_API, getJobTypes)
    const { data: paymentChannels } = useSWR(
        PAYMENT_CHANNEL_API,
        getPaymentChannels
    )
    const { data: jobStatuses } = useSWR(JOB_STATUS_API, getJobStatuses)
    const { data: projects, isLoading } = useSWR(
        [PROJECT_API, statusFilter],
        () => getProjects(statusFilter),
        {
            refreshInterval: 5000,
        }
    )

    const handleSwitch = async (project: Project, nextJobStatus: JobStatus) => {
        try {
            const data = await mutate(
                PROJECT_API,
                updateJobStatus(project, nextJobStatus)
            )
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const columns: TableProps<DataType>['columns'] = [
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
            filters: uniqueByKey(projects ?? [], 'clientName')?.map((item) => ({
                text: `${item.clientName}`,
                value: item?.clientName ?? '',
            })),
            onFilter: (value, record) =>
                record?.clientName?.indexOf(value as string) === 0,
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
            filters: uniqueByKey(jobTypes ?? [], 'code')?.map((item) => ({
                text: `${item.code}- ${item.name}`,
                value: item?.id ?? '',
            })),
            onFilter: (value, record) =>
                record?.jobTypeId?.toString().indexOf(value as string) === 0,
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
            render: () => (
                <p className="text-base font-semibold text-red-500">$ 10</p>
            ),
            sorter: {
                compare: (a, b) => a.income! - b.income!,
                multiple: 2,
            },
        },
        {
            title: 'Staff Cost',
            dataIndex: 'staffCost',
            key: 'staffCost',
            width: '10%',
            render: (staffCost) => (
                <p className="text-base font-semibold text-red-500">
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
            filters: uniqueByKey(paymentChannels ?? [], 'name')?.map(
                (item) => ({
                    text: `${item.name}`,
                    value: item?.name ?? '',
                })
            ),
            onFilter: (value, record) =>
                record!.paymentChannel.name!.indexOf(value as string) === 0,
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
                        options={{ format: 'full' }}
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
            filters: uniqueByKey(users ?? [], 'id')?.map((item) => ({
                text: `${item.name}`,
                value: item?.id ?? '',
            })),
            onFilter: (value, record) =>
                record?.memberAssign?.some((item) => item.id === value),
        },
        {
            title: 'Status',
            dataIndex: 'jobStatus',
            key: 'jobStatus',
            width: 140,
            render: (_, record: DataType) => (
                <Chip
                    style={{
                        backgroundColor: record.jobStatus.color,
                    }}
                    classNames={{
                        base: 'block max-w-[140px] flex items-center justify-start',
                        content:
                            'block max-w-[140px] uppercase text-sm font-semibold tracking-wide text-center',
                    }}
                >
                    {record.jobStatus.title}
                </Chip>
            ),
            filters: uniqueByKey(jobStatuses ?? [], 'id')?.map((item) => ({
                text: `${item.title}`,
                value: item?.id ?? '',
            })),
            onFilter: (value, record) =>
                record?.jobStatus?.id?.toString()?.indexOf(value as string) ===
                0,
        },
        {
            title: 'Action',
            key: 'action',
            width: '15%',
            render: (_, record: DataType) => {
                const nextJobStatusOrder =
                    record.jobStatus.order !== jobStatuses?.length
                        ? record.jobStatus.order! + 1
                        : null
                const nextJobStatus = jobStatuses?.find(
                    (item) => item.order === nextJobStatusOrder
                ) as JobStatus

                return (
                    <div className="flex items-center justify-start gap-2">
                        <Button
                            variant="light"
                            color="primary"
                            onPress={() => openModal(record.jobNo!)}
                            size="sm"
                        >
                            <EyeIcon />
                            View
                        </Button>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly variant="light" size="sm">
                                    <EllipsisVerticalIcon size={16} />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Project menu actions">
                                <DropdownSection showDivider>
                                    <DropdownItem
                                        key="switch"
                                        startContent={
                                            <ArrowLeftRight size={16} />
                                        }
                                        onPress={() =>
                                            handleSwitch(record, nextJobStatus)
                                        }
                                    >
                                        Switch to{' '}
                                        <Chip
                                            style={{
                                                backgroundColor:
                                                    nextJobStatus?.color,
                                                marginLeft: '5px',
                                            }}
                                        >
                                            {nextJobStatus?.title}
                                        </Chip>
                                    </DropdownItem>
                                </DropdownSection>
                                <DropdownSection>
                                    <DropdownItem
                                        key="delete"
                                        startContent={<Trash size={16} />}
                                        onClick={() => {}}
                                        color="danger"
                                    >
                                        Delete
                                    </DropdownItem>
                                </DropdownSection>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                )
            },
        },
    ]

    const headerColumns = columns.map((column) => ({
        title: column.title,
        key: column.key,
    }))

    const tabMenus: TabsProps['items'] = [
        {
            key: 'priority',
            label: (
                <button className="flex gap-2 items-center cursor-pointer">
                    <Badge
                        status="success"
                        count={projects?.length}
                        classNames={{
                            indicator: 'opacity-70 scale-80',
                        }}
                    >
                        <p className="px-3 uppercase">Priority</p>
                    </Badge>
                </button>
            ),
        },
        {
            key: 'active',
            label: (
                <button className="flex gap-2 items-center cursor-pointer">
                    <Badge
                        status="success"
                        count={projects?.length}
                        classNames={{
                            indicator: 'opacity-70 scale-80',
                        }}
                    >
                        <p className="px-3 uppercase">Active</p>
                    </Badge>
                </button>
            ),
        },
        {
            key: 'late',
            label: (
                <button className="flex gap-2 items-center cursor-pointer">
                    <Badge
                        status="success"
                        count={projects?.length}
                        classNames={{
                            indicator: 'opacity-70 scale-80',
                        }}
                    >
                        <p className="px-3 uppercase">Late</p>
                    </Badge>
                </button>
            ),
        },
        {
            key: 'delivered',
            label: (
                <button className="flex gap-2 items-center cursor-pointer">
                    <Badge
                        status="success"
                        count={projects?.length}
                        classNames={{
                            indicator: 'opacity-70 scale-80',
                        }}
                    >
                        <p className="px-3 uppercase">Delivered</p>
                    </Badge>
                </button>
            ),
        },
        {
            key: 'completed',
            label: (
                <button className="flex gap-2 items-center cursor-pointer">
                    <Badge
                        status="success"
                        count={projects?.length}
                        classNames={{
                            indicator: 'opacity-70 scale-80',
                        }}
                    >
                        <p className="px-3 uppercase">Completed</p>
                    </Badge>
                </button>
            ),
        },
        {
            key: 'cancelled',
            label: (
                <button className="flex gap-2 items-center cursor-pointer">
                    <Badge
                        status="success"
                        count={projects?.length}
                        classNames={{
                            indicator: 'opacity-70 scale-80',
                        }}
                    >
                        <p className="px-3 uppercase">Cancelled</p>
                    </Badge>
                </button>
            ),
        },
    ]

    const handleTabChange: TabsProps['onChange'] = (activeKey: string) => {
        if (activeKey === DEFAULT_TAB) {
            removeSearchParam('tab')
        } else {
            setSearchParams({ tab: activeKey })
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setKeywords(value)
        setSearchParams({ search: value })
    }

    const setVisibleColumns = (keys: SharedSelection) => {
        const newVisibleColumns = Array.from(keys)
        setProjectTable('visibleColumns', newVisibleColumns)
    }

    return (
        <>
            <div className="grid grid-cols-[1fr_1fr_160px] gap-3">
                <Tabs
                    activeKey={tabValue}
                    items={tabMenus}
                    onChange={handleTabChange}
                />
                <div style={{ flex: 1 }}>
                    <Input
                        placeholder="Search"
                        prefix={<Search size={16} color="#999" />}
                        size="large"
                        value={keywords}
                        onChange={handleInputChange}
                        style={{
                            borderRadius: '8px',
                            background: 'white',
                        }}
                    />
                </div>
                <Dropdown placement="bottom-end">
                    <DropdownTrigger className="hidden sm:flex">
                        <Button
                            endContent={<ChevronDownIcon size={16} />}
                            variant="flat"
                            className="text-sm font-medium"
                        >
                            Columns
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Table Columns"
                        closeOnSelect={false}
                        selectedKeys={projectTable.visibleColumns}
                        selectionMode="multiple"
                        onSelectionChange={setVisibleColumns}
                    >
                        {headerColumns?.map((column) => (
                            <DropdownItem
                                key={column.key as number}
                                className="capitalize"
                            >
                                {capitalize(`${column?.title}`)}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Table<DataType>
                columns={columns.filter((clm) =>
                    projectTable.visibleColumns?.includes(
                        clm.key as keyof Project | 'action'
                    )
                )}
                dataSource={projects?.map((prj, index) => ({
                    ...prj,
                    key: prj?.id ?? index,
                }))}
                loading={isLoading}
                pagination={{
                    position: ['bottomCenter'],
                    pageSize: 10,
                }}
                size={projectTable.size}
                rowClassName="h-8!"
                showSorterTooltip
            />
        </>
    )
}
