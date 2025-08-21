'use client'

import React, { useEffect, useState } from 'react'

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
    Input,
    Checkbox,
} from '@heroui/react'
import { SharedSelection } from '@heroui/react'
import { Image, Table } from 'antd'
import type { TableProps } from 'antd'
import { ChevronDownIcon, EyeIcon, Search } from 'lucide-react'

import { formatCurrencyVND } from '@/lib/formatCurrency'
import { uniqueByKey } from '@/lib/utils'
import { capitalize } from '@/lib/utils'
import { useUserOptionsStore } from '@/shared/components/FileManager/store/useUserOptionsStore'
import {
    ConfirmModal,
    useConfirmModal,
} from '@/shared/components/ui/ConfirmModal'
import { useSearchParam } from '@/shared/hooks/useSearchParam'

import { useDetailModal } from '../@detail/actions'
import { useJobStore } from '../store/useJobStore'
import ActionDropdown from './ActionDropdown'
import CountDown from './CountDown'
import { useUsers } from '@/queries/useUser'
import { useJobTypes } from '@/queries/useJobType'
import { usePaymentChannels } from '@/queries/usePaymentChannel'
import { Job } from '@/validationSchemas/job.schema'
import { useDeleteJobMutation, useJobs } from '@/queries/useJob'
import { TJobTab } from '@/app/api/(protected)/jobs/utils/getTabQuery'
import JobTableTabs from './JobTableTabs'

type DataType = Job & {
    key: React.Key
}

export default function JobTable() {
    const { getSearchParam, setSearchParams, removeSearchParam } =
        useSearchParam()
    const tabQuery = getSearchParam('tab') ?? 'priority'
    /**
     * Define states
     */
    const [keywords, setKeywords] = useState('')
    const [deleteJob, setDeleteJob] = useState<Job | null>(null)
    const [currentTab, setCurrentTab] = useState(tabQuery)
    const [currentPage, setCurrentPage] = useState(1)
    const [bulkSelected, setBulkSelected] = useState<number[]>([]) // Save Array<jobNo>
    /**
     * Instance hooks
     */
    const deleteModal = useConfirmModal()
    const { newJobNo, setNewJobNo } = useJobStore()
    const { projectTable, setProjectTable } = useUserOptionsStore()
    const { openModal } = useDetailModal()
    /**
     * Get initial data
     */
    const { data: users } = useUsers()
    const { data: jobTypes } = useJobTypes()
    const { data: paymentChannels } = usePaymentChannels()
    // const { data: jobStatuses } = useJobStatuses()
    const {
        jobs,
        isLoading: loadingJobs,
        meta,
    } = useJobs({
        tab: currentTab as TJobTab,
        page: currentPage,
        search: keywords,
    })
    /**
     * Import mutation
     */
    // const { mutateAsync: updateJobMutate, isIdle: isUpdatingJob } =
    //     useUpdateJobMutation()
    const { mutateAsync: deleteJobMutate, isIdle: isDeletingJob } =
        useDeleteJobMutation()

    const onSelectRow = (rowId: number) => {
        const foundIndex = bulkSelected.findIndex((i) => i === rowId)
        // isSelected -> remove
        if (foundIndex !== -1) {
            const res = [...bulkSelected]
            res.splice(foundIndex, 1)
            setBulkSelected(res)
        } else {
            setBulkSelected((pre) => [...pre, rowId])
        }
    }
    const columns: TableProps<DataType>['columns'] = [
        {
            title: '',
            dataIndex: 'select',
            key: 'select',
            width: 44,
            render: (_, record: DataType) => {
                const foundIndex = bulkSelected.findIndex(
                    (i) => i === record.id
                )
                const isActived = foundIndex !== -1
                return (
                    <div className="w-full flex items-center justify-center">
                        <Checkbox
                            size="sm"
                            isSelected={isActived}
                            onValueChange={() => onSelectRow(Number(record.id))}
                            classNames={{
                                base: 'block w-full flex items-center justify-center',
                            }}
                        />
                    </div>
                )
            },
        },
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
            filters: uniqueByKey(jobs ?? [], 'clientName')?.map((item) => ({
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
            render: () => <p className="font-semibold text-red-500">$ 10</p>,
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
            // filters: uniqueByKey(jobStatuses ?? [], 'id')?.map((item) => ({
            //     text: `${item.title}`,
            //     value: item?.id?.toString() ?? '',
            // })),
            onFilter: (value, record) =>
                record?.jobStatus?.id?.toString()?.indexOf(value as string) ===
                0,
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record: DataType) => {
                return (
                    <div className="px-4 flex items-center justify-end gap-2">
                        <Button
                            variant="light"
                            color="primary"
                            onPress={() => openModal(record.jobNo!)}
                            className="flex items-center justify-center"
                            size="sm"
                        >
                            <EyeIcon size={18} className="text-text-fore2" />
                            View
                        </Button>
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

    const headerColumns = columns!.map((column) => ({
        title: column.title,
        key: column.key,
    }))

    const handleTabChange = (activeKey: string) => {
        setCurrentTab(activeKey)
        if (activeKey === 'priority') {
            removeSearchParam('tab')
        } else {
            setSearchParams({ tab: activeKey })
        }
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
                isLoading={isDeletingJob}
                onConfirm={async () => {
                    try {
                        if (deleteJob) {
                            await deleteJobMutate(
                                deleteJob.id?.toString() as string
                            )
                            addToast({
                                title: 'Xóa dự án thành công',
                                color: 'success',
                            })
                        }
                        return
                    } catch (error) {
                        addToast({
                            title: 'Xóa dự án thất bại',
                            description: `${JSON.stringify(error)}`,
                            color: 'danger',
                        })
                    }
                }}
                variant="danger"
                title={`Delete ${deleteJob?.jobNo}`}
                message={
                    <div className="flex flex-col items-center">
                        <p className="text-base font-semibold">
                            Are you sure you want to delete this job?
                        </p>
                        <p className="mt-3 text-sm text-center">
                            This action will mark the job as deleted. You can
                            restore it later if needed.
                        </p>
                        <p className="text-sm text-center">
                            P/s: Deleted jobs will move to cancelled
                        </p>
                    </div>
                }
                confirmText="Delete"
            />
            <div className="grid grid-cols-[1fr_1fr_160px] gap-3">
                <JobTableTabs
                    activeKey={currentTab}
                    onChange={handleTabChange}
                />
                <Input
                    value={keywords}
                    startContent={
                        <Search size={18} className="text-text-fore2" />
                    }
                    onChange={(event) => {
                        const value = event.target.value
                        setKeywords(value)
                        setSearchParams({ search: value })
                    }}
                    placeholder="Tìm kiếm theo mã, tên dự án, khách hàng,..."
                />
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
            <div
                className="size-full p-1"
                style={{
                    borderRadius: '20px',
                }}
            >
                <Table<DataType>
                    columns={columns!.filter((clm) =>
                        projectTable.visibleColumns?.includes(
                            clm.key as keyof Job | 'action'
                        )
                    )}
                    rowKey="jobNo"
                    onHeaderRow={() => {
                        return {
                            style: {
                                background: 'var(--color-text4)',
                            },
                        }
                    }}
                    onRow={(record) => {
                        return {
                            className: `${
                                record.jobNo === newJobNo ? 'bg-yellow-200' : ''
                            } cursor-pointer`,
                            title: 'Double click to view',
                            onDoubleClick: () => openModal(record.jobNo!),
                            onClick: () => onSelectRow(Number(record.id)),
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
                        onChange(page) {
                            setCurrentPage(page)
                        },
                    }}
                    size={projectTable.size}
                    rowClassName="h-8! transition duration-500"
                    showSorterTooltip
                />
            </div>
        </>
    )
}
