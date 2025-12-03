'use client'

import { TJobFiltersInput, TJobQueryInput } from '@/lib/validationSchemas'
import ProjectCenterTableView from '@/shared/components/project-center/ProjectCenterTableView'
import TableContextMenu from '@/shared/components/project-center/TableContextMenu'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { useSearchParam } from '@/shared/hooks'
import { projectCenterStore } from '@/shared/stores'
import { TJob } from '@/shared/types'
import React, { use, useEffect } from 'react'

export type JobQueryParams = Omit<TJobQueryInput, 'hideFinishItems'>
export type JobFilterParams = TJobFiltersInput
export type JobSearchParams = TJobQueryInput & TJobFiltersInput & {}

const updateQueryParamsState = (params?: TJobQueryInput) => {
    projectCenterStore.setState((state) => {
        return {
            ...state,
            params,
        }
    })
}

export type DataType = TJob & {
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
