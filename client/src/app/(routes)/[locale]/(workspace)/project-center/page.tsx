'use client'

import { Button } from '@heroui/react'
import React, { useCallback, useState } from 'react'

import { useSearchParam } from '@/hooks/useSearchParam'
import PageHeading from '@/shared/components/layouts/PageHeading'
import { CONFIG_CONSTANTS } from '@/shared/constants/config.constant'
import { JobTabEnum } from '@/shared/enums/jobTab.enum'
import { Job } from '@/shared/interfaces/job.interface'
import { useConfigByCode } from '@/shared/queries/useConfig'
import { useJobColumns, useJobs } from '@/shared/queries/useJob'
import { DownloadIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import JobTableTabs from './components/JobTableTabs'
import DefaultPanel from './components/panels/DefaultPanel'
import PaginationPanel from './components/panels/PaginationPanel'
import JobTable from './components/tables/JobTable'

export type DataType = Job & {
    key: React.Key
}
export default function ProjectCenterPage() {
    const t = useTranslations()
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

    const handleTabChange = useCallback(
        (activeKey: string) => {
            setCurrentTab(activeKey)
            if (activeKey === 'priority') {
                removeSearchParam('tab')
            } else {
                setSearchParams({ tab: activeKey })
            }
        },
        [removeSearchParam, setSearchParams]
    )

    return (
        <>
            <PageHeading title={t('projectCenter')} />
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
                    onPress={() => {
                        alert(t('featureUnderDevelopment'))
                    }}
                >
                    {t('downloadAsCSV')}
                </Button>
            </div>
            <DefaultPanel
                defaultKeywords={searchKeywords}
                onSearch={(value) => {
                    setSearchParams({ search: value })
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
                            classNames: {
                                item: 'cursor-pointer',
                                next: 'cursor-pointer',
                                prev: 'cursor-pointer',
                            },
                            onChange(page) {
                                setCurrentJobPage(page)
                            },
                        }}
                        paginate={paginate}
                        onChangeItemsPerPage={(key) => {
                            setItemsPerPage(parseInt(key))
                        }}
                        isLoading={loadingJobs}
                    />
                </div>
            </div>
        </>
    )
}
