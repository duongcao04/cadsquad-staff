'use client'

import React, { useEffect, useState } from 'react'

import type { TableProps } from 'antd'
import { Table } from 'antd'

import { DataType } from '@/app/(routes)/[locale]/(dashboard)/onboarding/page'
import { useJobStore } from '@/app/(routes)/[locale]/(dashboard)/onboarding/store/useJobStore'
import { useAddMemberModal } from '@/shared/actions/useAddMemberModal'
import { useDetailModal } from '@/shared/actions/useDetailModal'
import { Job } from '@/shared/interfaces/job.interface'
import { useJobStatuses } from '@/shared/queries/useJobStatus'
import { useJobTypes } from '@/shared/queries/useJobType'
import { usePaymentChannels } from '@/shared/queries/usePaymentChannel'
import { useUsers } from '@/shared/queries/useUser'
import { JobColumn } from '@/shared/types/job.type'
import { jobColumns } from '../../columns/jobColumns'
import { useLocale } from 'next-intl'

type JobTableProps = {
    data: Job[]
    isLoading?: boolean
    showColumns?: JobColumn[]
    tableOptions?: TableProps<DataType>
}
export default function JobTable({
    data: jobsData,
    isLoading = false,
    showColumns,
    tableOptions = { scroll: { x: 'max-content', y: '100%' } },
}: JobTableProps) {
    const locale = useLocale()
    /**
     * Define states
     */
    // const [, setDeleteJob] = useState<Job | null>(null)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    /**
     * Instance hooks
     */
    const { openModal: openAddMemberModal } = useAddMemberModal()
    // const deleteModal = useConfirmModal()
    const { newJobNo, setNewJobNo } = useJobStore()
    const { openModal } = useDetailModal()
    /**
     * Get data from API
     */
    const { data: users } = useUsers()
    const { data: paymentChannels } = usePaymentChannels()
    const { data: jobTypes } = useJobTypes()
    const { data: jobStatuses } = useJobStatuses()

    const handleAssignMember = (jobNo: string) => {
        openAddMemberModal(jobNo)
    }
    const handleViewDetail = (jobNo: string) => {
        openModal(jobNo)
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

    const columns = jobColumns(
        {
            jobs: jobsData,
            jobStatuses: jobStatuses ?? [],
            jobTypes: jobTypes ?? [],
            paymentChannels: paymentChannels ?? [],
            users: users ?? [],
        },
        {
            onAssignMember: handleAssignMember,
            onViewDetail: handleViewDetail,
        },
        {
            locale,
            showColumns,
        }
    )

    const dataSource = jobsData?.map((prj, index) => ({
        ...prj,
        key: prj?.id ?? index,
    }))

    return (
        <>
            <Table<DataType>
                rowKey="no"
                columns={columns}
                onRow={(record) => {
                    return {
                        className: `${
                            record.no === newJobNo ? 'bg-yellow-200' : ''
                        }`,
                    }
                }}
                dataSource={dataSource}
                loading={isLoading}
                rowSelection={{
                    selectedRowKeys,
                    onChange: (newSelectedRowKeys: React.Key[]) =>
                        setSelectedRowKeys(newSelectedRowKeys),
                }}
                pagination={false}
                size={'small'}
                rowClassName="size-full !bg-background transition duration-500"
                scroll={tableOptions.scroll}
            />
        </>
    )
}
