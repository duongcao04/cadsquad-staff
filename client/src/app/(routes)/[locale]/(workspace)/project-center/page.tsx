'use client'

import { Button } from '@heroui/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { PageHeading } from '@/shared/components'
import { CONFIG_CONSTANTS } from '@/shared/constants'
import { JobTabEnum } from '@/shared/enums'
import { useSearchParam } from '@/shared/hooks'
import { Job } from '@/shared/interfaces'
import { useConfigByCode, useJobColumns, useJobs } from '@/shared/queries'
import { JobFiltersInput, JobQueryInput } from '@/shared/validationSchemas'
import { DownloadIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { DefaultPanel, JobTable, JobTableTabs, PaginationPanel } from './shared'
import lodash from 'lodash'

export type JobQueryParams = Omit<JobQueryInput, 'hideFinishItems'>
export type JobFilterParams = JobFiltersInput
export type JobSearchParams = JobQueryInput & JobFiltersInput & {}

export type DataType = Job & {
    key: React.Key
}

export default function ProjectCenterPage() {
    const t = useTranslations()
    const { getAllSearchParams, setSearchParams } = useSearchParam()

    const searchParams: JobSearchParams = getAllSearchParams()
    // Query params
    const initialParams = useMemo(() => {
        return {
            // Query params
            limit: searchParams.limit,
            page: searchParams.page,
            search: searchParams.search,
            sort: searchParams.sort,
            tab: searchParams.tab ?? JobTabEnum.PRIORITY,
        }
    }, [searchParams])
    // Filter params
    const initialFilterParams = useMemo(() => {
        return {
            clientName: searchParams.clientName,
            status: searchParams.status,
            type: searchParams.type,
            assignee: searchParams.assignee,
            completedAtFrom: searchParams.completedAtFrom,
            completedAtTo: searchParams.completedAtTo,
            createdAtFrom: searchParams.createdAtFrom,
            createdAtTo: searchParams.createdAtTo,
            dueAtFrom: searchParams.dueAtFrom,
            dueAtTo: searchParams.dueAtTo,
            finishedAtFrom: searchParams.finishedAtFrom,
            finishedAtTo: searchParams.finishedAtTo,
            paymentChannel: searchParams.paymentChannel,
            updatedAtFrom: searchParams.updatedAtFrom,
            updatedAtTo: searchParams.updatedAtTo,
        }
    }, [searchParams])
    const [params, setParams] = useState<JobQueryParams>(initialParams)
    const [filterParams] = useState<JobFilterParams>(initialFilterParams)

    useEffect(() => {
        const combineParams = { ...params, ...filterParams }
        setSearchParams(combineParams as Record<string, string>)
    }, [params, filterParams, setSearchParams])

    const { value: isHideFinishItems } = useConfigByCode(
        CONFIG_CONSTANTS.keys.hideFinishItems
    )
    const { jobColumns: showColumns } = useJobColumns()
    const {
        jobs,
        paginate,
        refetch: refreshJobs,
        isLoading: loadingJobs,
    } = useJobs({
        hideFinishItems: isHideFinishItems,
        ...params,
        ...filterParams,
    })

    const handleTabChange = useCallback((tab: string) => {
        setParams((prev) => ({ ...prev, tab, page: 1 }))
    }, [])

    const handlePageChange = useCallback((page: number) => {
        setParams((prev) => ({ ...prev, page }))
    }, [])

    const handleSearchChange = lodash.debounce(
        (search) => setParams((prev) => ({ ...prev, search, page: 1 })),
        500,
        { maxWait: 1000 }
    )

    const handleSortChange = useCallback((sort: string) => {
        setParams((prev) => ({ ...prev, sort, page: 1 }))
    }, [])

    const handleLimitChange = useCallback((limit: number) => {
        setParams((prev) => ({ ...prev, limit, page: 1 }))
    }, [])

    // TODO: use for filter set params
    // const handleFilterChange = useCallback((newValues: JobFilterParams) => {
    //     setFilterParams((prev) => ({ ...prev, ...newValues }))
    //     // Auto return page 1 after change filter
    //     setParams((prev) => ({ ...prev, page: 1 }))
    // }, [])

    return (
        <>
            <PageHeading title={t('projectCenter')} />
            <div className="pb-2 flex items-center justify-between">
                <JobTableTabs
                    activeKey={params.tab}
                    onChange={handleTabChange}
                />

                <Button
                    color="success"
                    variant="flat"
                    size="sm"
                    className="font-semibold"
                    startContent={<DownloadIcon size={14} />}
                    onPress={() => {
                        alert(t('featureUnderDevelopment'))
                    }}
                >
                    {t('downloadAsCSV')}
                </Button>
            </div>
            <DefaultPanel
                defaultKeywords={params.search}
                onSearch={(value) => {
                    handleSearchChange(value)
                }}
                onRefresh={refreshJobs}
                isRefreshing={loadingJobs}
            />
            <div className="pt-3 w-full h-[calc(100%-54px-44px-32px-12px)]">
                <div className="w-full h-[calc(100%-52px)]">
                    <JobTable
                        isLoading={loadingJobs}
                        data={jobs as Job[]}
                        showColumns={showColumns}
                        sortValue={params.sort}
                        onSort={handleSortChange}
                    />
                </div>
                <div className="h-[52px]">
                    <PaginationPanel
                        paginationProps={{
                            classNames: {
                                item: 'cursor-pointer',
                                next: 'cursor-pointer',
                                prev: 'cursor-pointer',
                            },
                            onChange(page) {
                                handlePageChange(page)
                            },
                        }}
                        paginate={paginate}
                        onChangeItemsPerPage={(key) => {
                            handleLimitChange(parseInt(key))
                        }}
                        isLoading={loadingJobs}
                    />
                </div>
            </div>
        </>
    )
}
