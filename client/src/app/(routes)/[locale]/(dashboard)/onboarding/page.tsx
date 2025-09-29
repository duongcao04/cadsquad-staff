'use client'

import { Button } from '@heroui/react'
import React, { useState } from 'react'

import JobTable from '@/shared/components/tables/JobTable'
import { useSearchParam } from '@/hooks/useSearchParam'
import JobTableTabs from './_components/JobTableTabs'
import { DownloadIcon } from 'lucide-react'
import { useJobColumns, useJobs } from '@/shared/queries/useJob'
import { Job } from '@/shared/interfaces/job.interface'
import { JobTabEnum } from '@/shared/enums/jobTab.enum'
import { useConfigByCode } from '@/shared/queries/useConfig'
import { CONFIG_CONSTANTS } from '@/shared/constants/config.constant'
import PageHeading from '../_components/PageHeading'
import DefaultPanel from './_components/panels/DefaultPanel'
import PaginationPanel from './_components/panels/PaginationPanel'

export type DataType = Job & {
    key: React.Key
}
export default function OnboardingPage() {
    const { jobColumns: showColumns } = useJobColumns()
    const { value: isHideFinishItems } = useConfigByCode(
        CONFIG_CONSTANTS.keys.hideFinishItems
    )
    const { getSearchParam, setSearchParams, removeSearchParam } =
        useSearchParam()
    const tabQuery = getSearchParam('tab') ?? JobTabEnum.PRIORITY
    const searchKeywords = getSearchParam('search') ?? ''

    const [currentTab, setCurrentTab] = useState(tabQuery)
    const [itemsPerPage, setItemsPerPage] = useState<number>(10)
    const [currentJobPage, setCurrentJobPage] = useState(1)

    const {
        jobs,
        paginate,
        refetch: refreshJobs,
        isLoading: loadingJobs,
    } = useJobs({
        tab: currentTab as JobTabEnum,
        page: currentJobPage,
        search: searchKeywords,
        limit: itemsPerPage,
        hideFinishItems: isHideFinishItems,
    })

    const handleTabChange = (activeKey: string) => {
        setCurrentTab(activeKey)
        if (activeKey === 'priority') {
            removeSearchParam('tab')
        } else {
            setSearchParams({ tab: activeKey })
        }
    }

    return (
        <>
            <PageHeading title="Onboarding" />
            <div className="pb-2 flex items-center justify-between">
                <JobTableTabs
                    activeKey={currentTab}
                    onChange={handleTabChange}
                />

                <Button
                    color="success"
                    variant="flat"
                    size="sm"
                    className="font-semibold"
                    startContent={<DownloadIcon size={14} />}
                >
                    Download tab as CSV
                </Button>
            </div>
            <DefaultPanel
                defaultKeywords={searchKeywords}
                onSearch={(value) => {
                    console.log(value)
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
                    />
                </div>
                <div className="h-[52px]">
                    <PaginationPanel
                        paginationProps={{
                            total: paginate?.totalPages ?? 1,
                            page: paginate?.page,
                            classNames: {
                                item: 'cursor-pointer',
                                next: 'cursor-pointer',
                                prev: 'cursor-pointer',
                            },
                            onChange(page) {
                                setCurrentJobPage(page)
                            },
                        }}
                        limitItems={{
                            limitValue: itemsPerPage.toString(),
                            onChange(key) {
                                setItemsPerPage(parseInt(key))
                            },
                        }}
                    />
                </div>
            </div>
        </>
    )
}
