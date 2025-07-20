'use client'

import React, { useEffect, useMemo, useState } from 'react'

import {
    Avatar,
    AvatarGroup,
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Tooltip,
    addToast,
} from '@heroui/react'
import { SharedSelection } from '@heroui/react'
import { Image, Table } from 'antd'
import type { TableProps } from 'antd'
import { Badge, Tabs, TabsProps } from 'antd'
import { Input } from 'antd'
import { ChevronDownIcon, EyeIcon, Search } from 'lucide-react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { formatCurrencyVND } from '@/lib/formatCurrency'
import { getJobStatuses } from '@/lib/swr/actions/jobStatus'
import { getJobTypes } from '@/lib/swr/actions/jobTypes'
import { getPaymentChannels } from '@/lib/swr/actions/paymentChannels'
import {
    deleteProject as deleteProjectAction,
    getProjectByTab,
} from '@/lib/swr/actions/project'
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
import {
    ConfirmModal,
    useConfirmModal,
} from '@/shared/components/ui/ConfirmModal'
import { useSearchParam } from '@/shared/hooks/useSearchParam'
import { Project } from '@/validationSchemas/project.schema'

import { useDetailModal } from '../@detail/actions'
import { useJobStore } from '../store/useJobStore'
import ActionDropdown from './ActionDropdown'
import CountDown from './CountDown'

const DEFAULT_TAB = 'priority'

type DataType = Project & {
    key: React.Key
}

export default function ProjectTable() {
    const [keywords, setKeywords] = useState('')
    const deleteModal = useConfirmModal()

    const [deleteProject, setDeleteProject] = useState<Project | null>(null)

    const { newJobNo, setNewJobNo } = useJobStore()
    const { projectTable, setProjectTable } = useUserOptionsStore()
    const { openModal } = useDetailModal()

    const { getSearchParam, setSearchParams, removeSearchParam } =
        useSearchParam()
    const tabValue = getSearchParam('tab') ?? DEFAULT_TAB

    const { trigger: deleteProjectMutation, isMutating } = useSWRMutation(
        PROJECT_API,
        async (url, { arg }: { arg: string }) => {
            return deleteProjectAction(arg)
        }
    )

    const { data: users } = useSWR(USER_API, getUsers)
    const { data: jobTypes } = useSWR(JOB_TYPE_API, getJobTypes)
    const { data: paymentChannels } = useSWR(
        PAYMENT_CHANNEL_API,
        getPaymentChannels
    )
    const { data: jobStatuses } = useSWR(JOB_STATUS_API, getJobStatuses)
    const {
        data: projectData,
        isLoading: loadingProjects,
        isValidating: validatingProjects,
        mutate: mutateProjects,
    } = useSWR([`${PROJECT_API}?tab=${tabValue}`], () =>
        getProjectByTab(tabValue)
    )
    const { projects, count } = useMemo(() => {
        return (
            projectData ?? { projects: [], count: {} as Record<string, number> }
        )
    }, [projectData])

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
                        <ActionDropdown
                            data={record}
                            setDeleteProject={setDeleteProject}
                            onOpen={deleteModal.onOpen}
                        />
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
                        count={count?.priority}
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
                        count={count?.active}
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
                        count={count?.late}
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
                        count={count?.delivered}
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
                        count={count?.completed}
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
                        count={count?.cancelled}
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

    // Remove hight after 1 second
    useEffect(() => {
        if (newJobNo) {
            const timeout = setTimeout(() => {
                setNewJobNo(null)
            }, 800)

            return () => clearTimeout(timeout)
        }
    }, [newJobNo])

    return (
        <>
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
                isLoading={isMutating}
                onConfirm={async () => {
                    try {
                        if (deleteProject) {
                            await deleteProjectMutation(
                                deleteProject.id?.toString() as string
                            )
                            await mutateProjects()
                            addToast({
                                title: 'Delete project successfully!',
                                color: 'success',
                            })
                        }
                        return
                    } catch (error) {
                        addToast({
                            title: 'Delete project failed!',
                            description: `${JSON.stringify(error)}`,
                            color: 'danger',
                        })
                    }
                }}
                variant="danger"
                title={`Delete ${deleteProject?.jobNo}`}
                message={
                    <div className="flex flex-col items-center">
                        <p className="text-base font-semibold">
                            Are you sure you want to delete this project?
                        </p>
                        <p className="mt-3 text-sm text-center">
                            This action will mark the project as deleted. You
                            can restore it later if needed.
                        </p>
                        <p className="text-sm text-center">
                            P/s: Deleted projects will move to cancelled
                        </p>
                    </div>
                }
                confirmText="Delete"
            />
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
                rowKey="jobNo"
                onRow={(record) => {
                    return {
                        className: `${record.jobNo === newJobNo ? 'bg-yellow-200' : ''} cursor-pointer`,
                        title: 'Double click to view',
                        onDoubleClick: () => openModal(record.jobNo!),
                    }
                }}
                dataSource={projects?.map((prj, index) => ({
                    ...prj,
                    key: prj?.id ?? index,
                }))}
                loading={loadingProjects || validatingProjects}
                pagination={{
                    position: ['bottomCenter'],
                    pageSize: 10,
                }}
                size={projectTable.size}
                rowClassName="h-8! transition duration-500"
                showSorterTooltip
            />
        </>
    )
}
