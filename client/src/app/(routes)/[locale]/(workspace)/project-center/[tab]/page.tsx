'use client'

import { JobFiltersInput, JobQueryInput } from '@/lib/validationSchemas'
import ProjectCenterTableView from '@/shared/components/project-center/ProjectCenterTableView'
import TableContextMenu from '@/shared/components/project-center/TableContextMenu'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { useSearchParam } from '@/shared/hooks'
import { Job } from '@/shared/interfaces'
import { projectCenterStore } from '@/shared/stores'
import React, { use, useEffect } from 'react'

export type JobQueryParams = Omit<JobQueryInput, 'hideFinishItems'>
export type JobFilterParams = JobFiltersInput
export type JobSearchParams = JobQueryInput & JobFiltersInput & {}

const updateQueryParamsState = (params?: JobQueryInput) => {
    projectCenterStore.setState((state) => {
        return {
            ...state,
            params,
        }
    })
}

export type DataType = Job & {
    key: React.Key
}
export default function ProjectCenterTabPage({
    params,
}: {
    params: Promise<{ tab: string }>
}) {
    const { tab } = use(params)

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

    return (
        <div className="py-3 size-full max-h-[calc(100%-150px)]">
            <TableContextMenu>
                <ProjectCenterTableView />
            </TableContextMenu>
        </div>
    )
}
