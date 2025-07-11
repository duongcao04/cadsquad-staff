'use client'

import React from 'react'

import { Button } from '@heroui/react'
import { Image, Table, Tag } from 'antd'
import { EyeIcon } from 'lucide-react'
import useSWR from 'swr'

import { formatCurrencyVND } from '@/lib/formatCurrency'
import { calcDueTo } from '@/lib/formatDate'
import { useSearchParam } from '@/shared/hooks/useSearchParam'
import { Project } from '@/validationSchemas/project.schema'

import { getProjects } from '../actions'

const { Column } = Table

type DataType = Project & {
    key: React.Key
}

export default function ProjectTable() {
    const { getSearchParam } = useSearchParam()
    const statusFilter = getSearchParam('tab')

    const { data: projects, isLoading } = useSWR(
        ['projects', statusFilter],
        () => getProjects(statusFilter)
    )

    return (
        <Table<DataType>
            dataSource={projects?.map((prj) => ({ ...prj, key: prj.id! }))}
            loading={isLoading}
        >
            <Column
                title=""
                dataIndex="thumbnail"
                key="thumbnail"
                width={100}
                render={(_, record: DataType) => {
                    return (
                        <div className="size-20 rounded-full overflow-hidden flex items-center justify-center">
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
            <Column title="Job No." dataIndex="jobNo" key="jobNo" width={200} />
            <Column
                title="Job Name"
                dataIndex="jobName"
                key="jobName"
                render={(jobName) => (
                    <p className="font-semibold uppercase">{jobName}</p>
                )}
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
            />
            <Column
                title="Due to"
                dataIndex="dueAt"
                key="dueAt"
                render={(_, record: DataType) => {
                    return (
                        <p>
                            {calcDueTo(
                                record.startedAt?.toString() as string,
                                record.dueAt?.toString() as string
                            )}
                        </p>
                    )
                }}
            />
            <Column
                title="Status"
                dataIndex="jobStatus"
                key="jobStatus"
                render={(_, record: DataType) => (
                    <Tag
                        color={record.jobStatus.color}
                        rootClassName="grid place-items-center w-40"
                    >
                        <p className="uppercase text-xl! font-semibold">
                            {record.jobStatus.title}
                        </p>
                    </Tag>
                )}
            />
            <Column
                title="Action"
                key="action"
                render={() => (
                    <div className="flex items-center justify-start gap-5">
                        <Button variant="light" color="primary">
                            <EyeIcon />
                            View
                        </Button>
                    </div>
                )}
            />
        </Table>
    )
}
