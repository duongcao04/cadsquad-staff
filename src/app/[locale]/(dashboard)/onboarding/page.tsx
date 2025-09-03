'use client'

import { Button, Input } from '@heroui/react'
import React, { useState } from 'react'

import JobTable from './_components/JobTable'
import { useSearchParam } from '@/shared/hooks/useSearchParam'
import JobTableTabs from './_components/JobTableTabs'
import { Job } from '@/validationSchemas/job.schema'
import FilterDropdown from './_components/FilterDropdown'
import ViewSettingsDropdown from './_components/ViewSettingsDropdown'
import { DownloadIcon, RefreshCcw, Search } from 'lucide-react'
import { useJobs } from '@/queries/useJob'
import { useJobStore } from './store/useJobStore'
import { TJobTab } from '@/app/api/(protected)/jobs/utils/getTabQuery'

export type DataType = Job & {
    key: React.Key
}
export default function OnboardingPage() {
    const { jobVisibleColumns, isHideFinishItems } = useJobStore()
    const { getSearchParam, setSearchParams, removeSearchParam } =
        useSearchParam()
    const tabQuery = getSearchParam('tab') ?? 'priority'
    const searchQuery = getSearchParam('search') ?? undefined

    const [currentTab, setCurrentTab] = useState(tabQuery)
    const [currentJobPage, setCurrentJobPage] = useState(1)
    const [searchKeywords, setSearchKeywords] = useState<string | undefined>(
        searchQuery
    )

    const {
        hideCols,
        jobs,
        refetch: refreshJobs,
        isLoading: loadingJobs,
        meta,
    } = useJobs({
        tab: currentTab as TJobTab,
        page: currentJobPage,
        search: searchKeywords,
        hideFinishItems: Boolean(isHideFinishItems),
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
        <div className="size-full">
            <div className="space-y-3">
                <JobTableTabs
                    activeKey={currentTab}
                    onChange={handleTabChange}
                />
                <div className="flex items-center justify-between gap-5">
                    <div className="grid grid-cols-[350px_90px_1fr] gap-3">
                        <Input
                            value={searchKeywords}
                            startContent={<Search size={18} />}
                            classNames={{
                                inputWrapper:
                                    'shadow-none border border-text3 bg-background',
                            }}
                            onChange={(event) => {
                                const value = event.target.value
                                setSearchKeywords(value)
                                setSearchParams({ search: value })
                            }}
                            placeholder="Tìm kiếm theo mã, tên dự án, khách hàng,..."
                        />
                        <FilterDropdown />
                        <Button
                            startContent={
                                <RefreshCcw
                                    size={14}
                                    className={
                                        loadingJobs ? 'animate-spin' : ''
                                    }
                                />
                            }
                            variant="bordered"
                            className="border-1"
                            onPress={() => refreshJobs()}
                        >
                            Refresh
                        </Button>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            color="success"
                            variant="flat"
                            className="font-semibold"
                            startContent={<DownloadIcon size={14} />}
                        >
                            Download as CSV
                        </Button>
                        <ViewSettingsDropdown />
                    </div>
                </div>
                <div
                    className="p-2 mt-4 size-full bg-background"
                    style={{
                        borderRadius: '20px',
                    }}
                >
                    <JobTable
                        visibleColumns={jobVisibleColumns.concat(hideCols)}
                        isLoading={loadingJobs}
                        data={jobs!}
                        pagination={{
                            pageSize: meta?.limit,
                            current: currentJobPage,
                            total: meta?.total,
                            onChange: (page) => {
                                setCurrentJobPage(page)
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
