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
import { Image, Table } from 'antd'
import {
    ArrowLeftRight,
    EllipsisVerticalIcon,
    EyeIcon,
    Trash,
} from 'lucide-react'
import useSWR from 'swr'

import { formatCurrencyVND } from '@/lib/formatCurrency'
import { JOB_STATUS_API, PROJECT_API } from '@/lib/swr/api'
import { useSearchParam } from '@/shared/hooks/useSearchParam'
import { Project } from '@/validationSchemas/project.schema'

import { getJobStatuses, getProjects } from '../actions'
import CountDown from './CountDown'

const { Column } = Table

type DataType = Project & {
    key: React.Key
}

export default function ProjectTable() {
    const { getSearchParam } = useSearchParam()
    const statusFilter = getSearchParam('tab')

    const { data: projects, isLoading } = useSWR(
        [PROJECT_API, statusFilter],
        () => getProjects(statusFilter)
    )

    const { data: jobStatuses } = useSWR(JOB_STATUS_API, getJobStatuses)

    return (
        <Table<DataType>
            dataSource={projects?.map((prj) => ({ ...prj, key: prj.id! }))}
            loading={isLoading}
            pagination={{
                position: ['bottomCenter'],
                pageSize: 6,
            }}
        >
            <Column
                title=""
                dataIndex="thumbnail"
                key="thumbnail"
                width={100}
                render={(_, record: DataType) => {
                    return (
                        <div className="size-16 rounded-full overflow-hidden flex items-center justify-center">
                            <Image
                                src={record.jobStatus.thumbnail}
                                alt="image"
                                className="size-full object-cover rounded-full"
                                preview={false}
                            />
                        </div>
                    )
                }}
            />
            <Column
                title="Job No."
                dataIndex="jobNo"
                key="jobNo"
                width={200}
                sorter={{
                    compare: (a, b) => a.jobNo.localeCompare(b.jobNo),
                    multiple: 1,
                }}
            />
            <Column
                title="Job Name"
                dataIndex="jobName"
                key="jobName"
                render={(jobName) => (
                    <p className="font-semibold uppercase">{jobName}</p>
                )}
                sorter={{
                    compare: (a, b) => a.jobName.localeCompare(b.jobName),
                    multiple: 3,
                }}
            />
            <Column
                title="Price"
                dataIndex="price"
                key="price"
                render={(price) => (
                    <p className="text-base font-semibold text-red-500">
                        {formatCurrencyVND(price)}
                    </p>
                )}
                sorter={{
                    compare: (a, b) => a.price - b.price,
                    multiple: 2,
                }}
            />
            <Column
                title="Due to"
                dataIndex="dueAt"
                key="dueAt"
                render={(_, record: DataType) => {
                    return <CountDown endedDate={record.dueAt!} />
                }}
            />
            <Column
                title="Status"
                dataIndex="jobStatus"
                key="jobStatus"
                render={(_, record: DataType) => (
                    <Chip
                        style={{
                            backgroundColor: record.jobStatus.color,
                        }}
                    >
                        <p className="uppercase text-sm! font-semibold tracking-wide">
                            {record.jobStatus.title}
                        </p>
                    </Chip>
                )}
            />
            <Column
                title="Action"
                key="action"
                render={(_, record: DataType) => {
                    const nextJobStatus =
                        record.jobStatus.order !== jobStatuses?.length
                            ? record.jobStatus.order! + 1
                            : null

                    return (
                        <div className="flex items-center justify-start gap-1">
                            <Button variant="light" color="primary">
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
                                        >
                                            Switch to{' '}
                                            <Chip
                                                style={{
                                                    backgroundColor:
                                                        jobStatuses?.find(
                                                            (item) =>
                                                                item.order ===
                                                                nextJobStatus
                                                        )?.color,
                                                    marginLeft: '5px',
                                                }}
                                            >
                                                {
                                                    jobStatuses?.find(
                                                        (item) =>
                                                            item.order ===
                                                            nextJobStatus
                                                    )?.title
                                                }
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
                }}
            />
        </Table>
    )
}
