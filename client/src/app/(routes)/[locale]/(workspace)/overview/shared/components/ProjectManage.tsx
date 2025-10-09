'use client'

import React from 'react'

import { Button } from '@heroui/react'
import { Table } from 'antd'
import { ChevronRight } from 'lucide-react'

import { Link } from '@/i18n/navigation'

import {
    Job,
    JobStatus,
    JobType,
    PaymentChannel,
    User,
} from '@/shared/interfaces'
import {
    useJobs,
    useJobStatuses,
    useJobTypes,
    usePaymentChannels,
    useUsers,
} from '@/shared/queries'
import { useTranslations } from 'use-intl'
import { jobColumns } from '../../../project-center/shared'

type DataType = Job & {
    key: React.Key
}

export default function ProjectManage() {
    const t = useTranslations()
    const { jobs } = useJobs()
    const { data: jobStatuses } = useJobStatuses()
    const { data: jobTypes } = useJobTypes()
    const { data: paymentChannels } = usePaymentChannels()
    const { users } = useUsers()

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
                <Link className="block" href={'/project-center?tab=active'}>
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
                columns={jobColumns(
                    {
                        jobs: jobs as Job[],
                        jobStatuses: jobStatuses as JobStatus[],
                        jobTypes: jobTypes as JobType[],
                        paymentChannels: paymentChannels as PaymentChannel[],
                        users: users as User[],
                    },
                    {},
                    { translations: t }
                )}
                rowKey="jobNo"
                dataSource={jobs?.map((prj, index) => ({
                    ...prj,
                    key: prj?.id ?? index,
                }))}
                // loading={loadingProjects && validatingProjects}
                pagination={false}
                // size={table.size}
                rowClassName="h-8! transition duration-500"
                showSorterTooltip
            />
        </div>
    )
}
