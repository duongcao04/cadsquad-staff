'use client'

import React, { useMemo } from 'react'

import { Avatar, AvatarGroup, Button, Chip, Tooltip } from '@heroui/react'
import { Table, TableProps } from 'antd'
import { ChevronRight } from 'lucide-react'
import useSWR from 'swr'

import { Link } from '@/i18n/navigation'
import { formatCurrencyVND } from '@/lib/formatCurrency'
import { getProjectByTab } from '@/lib/swr/actions/project'
import { PROJECT_API } from '@/lib/swr/api'

import CountDown from '../../onboarding/_components/CountDown'
import { useSettingStore } from '../../../settings/shared/store/useSettingStore'
import { Job } from '../../../../../validationSchemas/job.schema'

const DEFAULT_TAB = 'active'

type DataType = Job & {
    key: React.Key
}

export default function ProjectManage() {
    const { table } = useSettingStore()

    const {
        data: projectData,
        isLoading: loadingProjects,
        isValidating: validatingProjects,
    } = useSWR([`${PROJECT_API}?tab=${DEFAULT_TAB}`], () =>
        getProjectByTab('active')
    )

    const { projects } = useMemo(() => {
        return (
            projectData ?? { projects: [], count: {} as Record<string, number> }
        )
    }, [projectData])

    const columns: TableProps<DataType>['columns'] = [
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
        },
    ]
    return (
        <div
            className="p-2 rounded-2xl h-full border border-gray-100"
            style={{
                boxShadow:
                    'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
            }}
        >
            <div className="pl-3 pr-5 py-3 w-full flex items-center justify-between">
                <h3 className="font-semibold text-lg text-secondary">
                    Active Projects
                </h3>
                <Link className="block" href={'/onboarding?tab=active'}>
                    <Button
                        size="sm"
                        endContent={<ChevronRight size={16} />}
                        variant="light"
                        color="secondary"
                        className="rounded-full"
                    >
                        View all
                    </Button>
                </Link>
            </div>
            <Table<DataType>
                columns={columns}
                rowKey="jobNo"
                dataSource={projects?.map((prj, index) => ({
                    ...prj,
                    key: prj?.id ?? index,
                }))}
                loading={loadingProjects && validatingProjects}
                pagination={false}
                size={table.size}
                rowClassName="h-8! transition duration-500"
                showSorterTooltip
            />
        </div>
    )
}
