/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useConfigByCode, useJobColumns, useJobs } from '@/lib/queries'
import { USER_CONFIG_KEYS } from '@/lib/utils'
import { JobFiltersInput, JobQueryInput } from '@/lib/validationSchemas'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { useSearchParam } from '@/shared/hooks'
import { Job } from '@/shared/interfaces'
import React, { use, useEffect } from 'react'
import {
    projectCenterStore,
    ProjectCenterTable,
    useProjectCenter,
} from '../shared'

export type JobQueryParams = Omit<JobQueryInput, 'hideFinishItems'>
export type JobFilterParams = JobFiltersInput
export type JobSearchParams = JobQueryInput & JobFiltersInput & {}

export type DataType = Job & {
    key: React.Key
}

export default function ProjectCenterTabPage({
    params,
}: {
    params: Promise<{ tab: string }>
}) {
    const { tab } = use(params)
    const { queryParamsState, updateQueryParamsState } = useProjectCenter()

    const { getAllSearchParams } = useSearchParam()
    const getSearchParams: JobQueryParams = getAllSearchParams()

    useEffect(() => {
        projectCenterStore.setState((state) => {
            return {
                ...state,
                tab: tab as unknown as ProjectCenterTabEnum,
            }
        })
        updateQueryParamsState(getSearchParams)
    }, [tab, getSearchParams])

    useEffect(() => {
        // setSearchParams(queryParamsState as unknown as Record<string, string>)
    }, [updateQueryParamsState])

    const { value: isHideFinishItems } = useConfigByCode(
        USER_CONFIG_KEYS.hideFinishItems
    )
    const { jobColumns: showColumns } = useJobColumns()
    const {
        jobs,
        paginate,
        refetch: refreshJobs,
        isLoading: loadingJobs,
    } = useJobs({
        hideFinishItems: isHideFinishItems,
        ...queryParamsState,
        tab,
    })

    // const handleSearchChange = lodash.debounce(
    //     (search) => setParams((prev) => ({ ...prev, search, page: 1 })),
    //     500,
    //     { maxWait: 1000 }
    // )

    return (
        <>
            {/* <Button
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
                </Button> */}
            <div className="pt-3 w-full h-[calc(100%-54px-44px-32px-12px)]">
                <div className="w-full h-[calc(100%-52px)]">
                    <ProjectCenterTable
                        data={jobs ?? []}
                        onRefresh={refreshJobs}
                        isLoading={loadingJobs}
                        visibleColumns={showColumns ?? []}
                    />
                </div>
            </div>
        </>
    )
}
