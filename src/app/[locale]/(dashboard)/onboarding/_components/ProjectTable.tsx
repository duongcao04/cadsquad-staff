'use client'

import React from 'react'

import {
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from '@heroui/react'
import { Table } from 'antd'
import type { TableProps } from 'antd'
import {
    ArrowLeftRight,
    EllipsisVerticalIcon,
    EyeIcon,
    Trash,
} from 'lucide-react'
import useSWR, { mutate } from 'swr'

import { formatCurrencyVND } from '@/lib/formatCurrency'
import { getJobStatuses, updateJobStatus } from '@/lib/swr/actions/jobStatus'
import { getProjects } from '@/lib/swr/actions/project'
import { JOB_STATUS_API, PROJECT_API } from '@/lib/swr/api'
import { useUserOptionsStore } from '@/shared/components/FileManager/store/useUserOptionsStore'
import { useSearchParam } from '@/shared/hooks/useSearchParam'
import { JobStatus, Project } from '@/validationSchemas/project.schema'

import { useDetailModal } from '../@detail/actions'
import CountDown from './CountDown'

type DataType = Project & {
    key: React.Key
}

export default function ProjectTable() {
    const { openModal } = useDetailModal()
    const { projectTable } = useUserOptionsStore()
    const { getSearchParam } = useSearchParam()
    const statusFilter = getSearchParam('tab')

    const { data: jobStatuses } = useSWR(JOB_STATUS_API, getJobStatuses)
    const { data: projects, isLoading } = useSWR(
        [PROJECT_API, statusFilter],
        () => getProjects(statusFilter)
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
        // {
        //     title: '',
        //     dataIndex: 'thumbnail',
        //     key: 'thumbnail',
        //     width: 100,
        //     render: (_, record: DataType) => {
        //         return (
        //             <div className="size-16 rounded-full overflow-hidden flex items-center justify-center">
        //                 <Image
        //                     src={record.jobStatus.thumbnail}
        //                     alt="image"
        //                     className="size-full object-cover rounded-full"
        //                     preview={false}
        //                 />
        //             </div>
        //         )
        //     },
        // },
        {
            title: 'Client',
            dataIndex: 'jobNo',
            key: 'jobNo',
            width: '10%',
            sorter: {
                compare: (a, b) => a.jobNo!.localeCompare(b.jobNo!),
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
                <p className="font-semibold uppercase">{jobName}</p>
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
                compare: (a, b) => a.price! - b.price!,
                multiple: 2,
            },
        },
        {
            title: 'Staff Cost',
            dataIndex: 'price',
            key: 'price',
            width: '10%',
            render: (price) => (
                <p className="text-base font-semibold text-red-500">
                    {formatCurrencyVND(price)}
                </p>
            ),
            sorter: {
                compare: (a, b) => a.price! - b.price!,
                multiple: 2,
            },
        },
        {
            title: 'Payment Channel',
            dataIndex: 'price',
            key: 'price',
            width: '10%',
            render: () => <p>ACB</p>,
            sorter: {
                compare: (a, b) => a.price! - b.price!,
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
                        options={{ format: 'full' }}
                    />
                )
            },
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
                        base: 'block max-w-full flex items-center justify-start',
                        content:
                            'block w-full uppercase text-sm font-semibold tracking-wide text-center',
                    }}
                >
                    {record.jobStatus.title}
                </Chip>
            ),
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
                    <div className="flex items-center justify-start gap-1">
                        <Button
                            variant="light"
                            color="primary"
                            onPress={() => openModal(record.jobNo!)}
                        >
                            <EyeIcon />
                            View
                        </Button>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly variant="light">
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

    return (
        <>
            <Table<DataType>
                columns={columns}
                dataSource={projects?.map((prj) => ({ ...prj, key: prj.id! }))}
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
