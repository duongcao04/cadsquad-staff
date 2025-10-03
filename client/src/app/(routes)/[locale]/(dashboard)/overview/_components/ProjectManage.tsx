'use client'

import React from 'react'

import { Button } from '@heroui/react'
import { Table } from 'antd'
import { ChevronRight } from 'lucide-react'

import { Link } from '@/i18n/navigation'

import { useJobs } from '@/shared/queries/useJob'
import { Job } from '@/shared/interfaces/job.interface'
import { jobColumns } from '../../onboarding'
import { useJobStatuses } from '@/shared/queries/useJobStatus'
import { useJobTypes } from '@/shared/queries/useJobType'
import { usePaymentChannels } from '@/shared/queries/usePaymentChannel'
import { useUsers } from '@/shared/queries/useUser'
import { JobStatus } from '@/shared/interfaces/jobStatus.interface'
import { JobType } from '@/shared/interfaces/jobType.interface'
import { PaymentChannel } from '@/shared/interfaces/paymentChannel.interface'
import { User } from '@/shared/interfaces/user.interface'

type DataType = Job & {
    key: React.Key
}

export default function ProjectManage() {
    const { jobs } = useJobs()
    const { data: jobStatuses } = useJobStatuses()
    const { data: jobTypes } = useJobTypes()
    const { data: paymentChannels } = usePaymentChannels()
    const { data: users } = useUsers()

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
                columns={jobColumns(
                    {
                        jobs: jobs as Job[],
                        jobStatuses: jobStatuses as JobStatus[],
                        jobTypes: jobTypes as JobType[],
                        paymentChannels: paymentChannels as PaymentChannel[],
                        users: users as User[],
                    },
                    {},
                    {}
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
