'use client'

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
} from '@heroui/react'
import React, { useState } from 'react'
import { ChevronDownIcon, Search } from 'lucide-react'

import JobTable from './_components/JobTable'
import { JobStore, useJobStore } from './store/useJobStore'
import { useSearchParam } from '@/shared/hooks/useSearchParam'
import JobTableTabs from './_components/JobTableTabs'
import { TableColumnsType } from 'antd'
import { Job } from '@/validationSchemas/job.schema'
import { capitalize } from 'lodash'

export type DataType = Job & {
    key: React.Key
}
export default function OnboardingPage() {
    const { jobVisibleColumns, setJobVisibleColumns } = useJobStore()
    const { getSearchParam, setSearchParams, removeSearchParam } =
        useSearchParam()
    const tabQuery = getSearchParam('tab') ?? 'priority'

    const [currentTab, setCurrentTab] = useState(tabQuery)

    const handleTabChange = (activeKey: string) => {
        setCurrentTab(activeKey)
        if (activeKey === 'priority') {
            removeSearchParam('tab')
        } else {
            setSearchParams({ tab: activeKey })
        }
    }

    const headerColumns: TableColumnsType<DataType> = [
        {
            title: 'Thumbnail',
            key: 'thumbnail',
            dataIndex: 'thumbnail',
        },
        {
            title: 'Client',
            key: 'clientName',
            dataIndex: 'clientName',
        },
        {
            title: 'Job No.',
            key: 'jobNo',
            dataIndex: 'jobNo',
        },
        {
            title: 'Job name',
            key: 'jobName',
            dataIndex: 'jobName',
        },
        {
            title: 'Income',
            key: 'income',
            dataIndex: 'income',
        },
        {
            title: 'Staff cost',
            key: 'staffCost',
            dataIndex: 'staffCost',
        },
        {
            title: 'Payment channel',
            key: 'paymentChannel',
            dataIndex: 'paymentChannel',
        },
        {
            title: 'Due to',
            key: 'dueAt',
            dataIndex: 'dueAt',
        },
        {
            title: 'Assignee',
            key: 'memberAssign',
            dataIndex: 'memberAssign',
        },
        {
            title: 'Status',
            key: 'jobStatus',
            dataIndex: 'jobStatus',
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
        },
    ]

    return (
        <div className="size-full">
            <div className="space-y-3">
                {/* <ConfirmModal
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
                                This action will mark the job as deleted. You
                                can restore it later if needed.
                            </p>
                            <p className="text-sm text-center">
                                P/s: Deleted jobs will move to cancelled
                            </p>
                        </div>
                    }
                    confirmText="Delete"
                /> */}
                <JobTableTabs
                    activeKey={currentTab}
                    onChange={handleTabChange}
                />
                <div className="grid grid-cols-[1fr_1fr_160px] gap-3">
                    <Input
                        // value={keywords}
                        startContent={
                            <Search size={18} className="text-text-fore2" />
                        }
                        // onChange={(event) => {
                        //     const value = event.target.value
                        //     setKeywords(value)
                        //     setSearchParams({ search: value })
                        // }}
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
                            selectedKeys={jobVisibleColumns}
                            selectionMode="multiple"
                            onSelectionChange={(keys) => {
                                setJobVisibleColumns(
                                    Array.from(
                                        keys
                                    ) as JobStore['jobVisibleColumns']
                                )
                            }}
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
                    className="size-full p-2 bg-background2"
                    style={{
                        borderRadius: '20px',
                    }}
                >
                    <JobTable currentTab={currentTab} />
                </div>
            </div>
        </div>
    )
}
