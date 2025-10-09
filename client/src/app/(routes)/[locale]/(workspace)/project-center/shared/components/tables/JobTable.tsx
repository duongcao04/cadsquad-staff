'use client'

import React, { useEffect, useState } from 'react'

import type { TableProps } from 'antd'
import { Table } from 'antd'

import { useAddMemberModal, useDetailModal } from '@/shared/actions'
import { Job } from '@/shared/interfaces'
import {
    useJobStatuses,
    useJobTypes,
    usePaymentChannels,
    useUsers,
} from '@/shared/queries'
import { JobColumn } from '@/shared/types'
import { useLocale, useTranslations } from 'next-intl'
import { DataType } from '../../../page'
import { jobColumns } from '../../columns'
import { useJobStore } from '../../store'

type JobTableProps = {
    data: Job[]
    isLoading?: boolean
    showColumns?: JobColumn[]
    tableOptions?: TableProps<DataType>
}
function JobTable({
    data: jobsData,
    isLoading = false,
    showColumns,
    tableOptions = { scroll: { x: 'max-content', y: '100%' } },
}: JobTableProps) {
    const t = useTranslations()
    const locale = useLocale()
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    /**
     * Instance hooks
     */
    const { openModal: openAddMemberModal } = useAddMemberModal()
    const { newJobNo, setNewJobNo } = useJobStore()
    const { openModal } = useDetailModal()
    /**
     * Get data from API
     */
    const { users } = useUsers()
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
            translations: t,
        }
    )

    const dataSource = jobsData?.map((prj, index) => ({
        ...prj,
        key: prj?.id ?? index,
    }))

    return (
        <Table<DataType>
            rowKey="no"
            columns={columns}
            onRow={(record) => {
                return {
                    className: `${
                        record.no === newJobNo
                            ? 'bg-yellow-200'
                            : '!bg-background !text-foreground'
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
    )
}
export default React.memo(JobTable)
