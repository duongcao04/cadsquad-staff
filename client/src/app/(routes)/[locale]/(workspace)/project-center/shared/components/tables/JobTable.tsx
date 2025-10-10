'use client'

import { parseSortParam } from '@/lib/utils'
import { useAddMemberModal, useDetailModal } from '@/shared/actions'
import { Job } from '@/shared/interfaces'
import {
    useJobStatuses,
    useJobTypes,
    usePaymentChannels,
    useUsers,
} from '@/shared/queries'
import { JobColumn } from '@/shared/types'
import type { TableProps } from 'antd'
import { Table } from 'antd'
import { SorterResult } from 'antd/es/table/interface'
import lodash from 'lodash'
import { useLocale, useTranslations } from 'next-intl'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { DataType, JobFilterParams } from '../../../page'
import { jobColumns } from '../../columns'
import { useJobStore } from '../../store'

type JobTableProps = {
    data: Job[]
    isLoading?: boolean
    showColumns?: JobColumn[]
    tableOptions?: TableProps<DataType>
    sortValue?: string
    filterValue?: JobFilterParams
    onSort?: (sort: string) => void
    onFilter?: (newValues: JobFilterParams) => void
}

function JobTable({
    data: jobsData,
    isLoading = false,
    showColumns,
    sortValue,
    onSort,
    filterValue,
    onFilter,
    tableOptions = { scroll: { x: 'max-content', y: '100%' } },
}: JobTableProps) {
    const t = useTranslations()
    const locale = useLocale()
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    const { openModal: openAddMemberModal } = useAddMemberModal()
    const { newJobNo, setNewJobNo } = useJobStore()
    const { openModal } = useDetailModal()

    const { users } = useUsers()
    const { data: paymentChannels } = usePaymentChannels()
    const { data: jobTypes } = useJobTypes()
    const { data: jobStatuses } = useJobStatuses()

    const handleAssignMember = useCallback(
        (jobNo: string) => openAddMemberModal(jobNo),
        [openAddMemberModal]
    )
    const handleViewDetail = useCallback(
        (jobNo: string) => openModal(jobNo),
        [openModal]
    )

    useEffect(() => {
        if (newJobNo) {
            const timeout = setTimeout(() => setNewJobNo(null), 800)
            return () => clearTimeout(timeout)
        }
    }, [newJobNo, setNewJobNo])

    // Parse sort query string to AntD order
    const sortOrderMap = useMemo(() => {
        const parsed = parseSortParam(sortValue ?? '')
        return Object.fromEntries(
            parsed.map((item) => {
                const key = Object.keys(item)[0]
                const order = item[key] === 'asc' ? 'ascend' : 'descend'
                return [key, order]
            })
        )
    }, [sortValue])

    const columns = useMemo(() => {
        return jobColumns(
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
            { locale, showColumns, translations: t, filterValue }
        ).map((col) => ({
            ...col,
            sortOrder: sortOrderMap[col.key as string],
        }))
    }, [
        jobsData,
        jobStatuses,
        jobTypes,
        paymentChannels,
        users,
        showColumns,
        sortOrderMap,
        locale,
        t,
        handleAssignMember,
        handleViewDetail,
        filterValue,
    ])

    const handleTableChange: TableProps<DataType>['onChange'] = (
        _pagination,
        _filters,
        _sorter
    ) => {
        // Handle sort
        let sorts: SorterResult<DataType>[] = []
        if (Array.isArray(_sorter)) sorts = _sorter
        else if (_sorter && _sorter.field) sorts = [_sorter]

        const sortQuery = sorts
            .map((s) => {
                if (!s.field || !s.order) return ''
                const prefix = s.order === 'descend' ? '-' : '+'
                return `${prefix}${s.field}`
            })
            .filter(Boolean)
            .join(',')

        // Handle sort safely
        if (onSort) {
            onSort(sortQuery)
        }

        // Handle filters safely
        if (onFilter) {
            /**
             * Converts a filters object into a query string for use in URLs.
             *
             * This function removes all `null` values from the `_filters` object,
             * then serializes it into a URL-friendly query string using the
             * `query-string` library.
             *
             * Arrays are joined with commas (`arrayFormat: 'comma'`), so an input like:
             * ```ts
             * {
             *   clientName: ['Christian Carter', 'Dr. Casey'],
             *   type: ['FV', 'OTH']
             * }
             * ```
             * becomes:
             * ```
             * clientName=Christian%20Carter,Dr.%20Casey&type=FV,OTH
             * ```
             *  */
            const filters = lodash.omitBy(_filters, lodash.isNull)
            onFilter(filters)
            console.log(filterValue)
        }
    }

    const dataSource = jobsData?.map((prj, index) => ({
        ...prj,
        key: prj?.id ?? index,
    }))

    return (
        <Table<DataType>
            rowKey="no"
            columns={columns}
            onRow={(record) => ({
                className:
                    record.no === newJobNo
                        ? 'bg-yellow-200'
                        : '!bg-background !text-foreground',
            })}
            onChange={handleTableChange}
            dataSource={dataSource}
            loading={isLoading}
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            pagination={false}
            size="small"
            rowClassName="size-full !bg-background transition duration-500"
            scroll={tableOptions.scroll}
        />
    )
}

export default React.memo(JobTable)
