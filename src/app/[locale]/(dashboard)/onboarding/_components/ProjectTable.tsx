'use client'

import React, { useEffect, useState } from 'react'

import { Image, Table } from 'antd'

import { formatCurrencyVND } from '@/lib/formatCurrency'
import { calcDueTo } from '@/lib/formatDate'
import { Project } from '@/validationSchemas/project.schema'

const { Column, ColumnGroup } = Table

type DataType = Project & {
    key: React.Key
}

export default function ProjectTable() {
    const [projects, setProjects] = useState([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/projects', {
                    method: 'GET',
                })
                const data = await res.json()
                setProjects(data.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    return (
        <Table<DataType> dataSource={projects} loading={isLoading}>
            <ColumnGroup title="Job No">
                <Column
                    title="Thumbnail"
                    dataIndex="thumbnail"
                    key="thumbnail"
                    width={200}
                    render={(thumbnailUrl) => {
                        return (
                            <div className="w-[160px] h-[70px]">
                                <Image
                                    src={thumbnailUrl}
                                    alt="image"
                                    className="size-full object-cover"
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
                />
            </ColumnGroup>
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
                                record.startedAt as string,
                                record.dueAt as string
                            )}
                        </p>
                    )
                }}
            />
            <Column
                title="Status"
                dataIndex="status"
                key="status"
                render={(status) => <p>{status}</p>}
            />
            <Column
                title="Action"
                key="action"
                render={(_, record: DataType) => (
                    <div>
                        <p>View</p>
                    </div>
                )}
            />
        </Table>
    )
}
