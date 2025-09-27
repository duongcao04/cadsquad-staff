'use client'

import { Button, Input, Pagination, Select, SelectItem } from '@heroui/react'
import React, { useState } from 'react'

import JobTable from '../../../../../shared/components/tables/JobTable'
import { useSearchParam } from '@/hooks/useSearchParam'
import JobTableTabs from './_components/JobTableTabs'
import FilterDropdown from './_components/FilterDropdown'
import ViewSettingsDropdown from './_components/ViewSettingsDropdown'
import { DownloadIcon, RefreshCcw, Search } from 'lucide-react'
import { useJobColumns, useJobs } from '@/shared/queries/useJob'
import { Job } from '@/shared/interfaces/job.interface'
import { JobTabEnum } from '@/shared/enums/jobTab.enum'
import { useConfigByCode } from '@/shared/queries/useConfig'
import { CONFIG_CONSTANTS } from '@/shared/constants/config.constant'

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
    const searchQuery = getSearchParam('search') ?? undefined

    const [currentTab, setCurrentTab] = useState(tabQuery)
    const [currentItemsPerPage, setCurrentItemsPerPage] = useState(5)
    const [currentJobPage, setCurrentJobPage] = useState(1)
    const [searchKeywords, setSearchKeywords] = useState<string | undefined>(
        searchQuery
    )

    const {
        jobs,
        paginate,
        refetch: refreshJobs,
        isLoading: loadingJobs,
    } = useJobs({
        tab: currentTab as JobTabEnum,
        page: currentJobPage,
        search: searchKeywords,
        limit: currentItemsPerPage,
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
                <div className="w-full flex items-center justify-between px-2">
                    <p className="text-sm text-text2">
                        Total {paginate?.total} items
                    </p>
                    <div className="flex items-center justify-end gap-2">
                        <p className="text-sm text-text2 text-nowrap">
                            Rows per page
                        </p>
                        <Select
                            className="w-20 cursor-pointer"
                            selectedKeys={[currentItemsPerPage]}
                            onChange={(e) => {
                                const value = e.target.value
                                setCurrentItemsPerPage(parseInt(value))
                            }}
                            scrollShadowProps={{
                                isEnabled: false,
                            }}
                        >
                            {[5, 10, 15, 20, 25]
                                .map((item) => ({ key: item, label: item }))
                                .map((number, idx) => (
                                    <SelectItem key={number.key + idx}>
                                        {number.label}
                                    </SelectItem>
                                ))}
                        </Select>
                    </div>
                </div>
                <JobTable
                    isLoading={loadingJobs}
                    data={jobs as Job[]}
                    showColumns={showColumns}
                />
                <div className="w-full flex items-center justify-center">
                    <Pagination
                        color="primary"
                        showControls
                        total={paginate?.totalPages ?? 1}
                        page={paginate?.page}
                        classNames={{
                            item: 'cursor-pointer',
                            next: 'cursor-pointer',
                            prev: 'cursor-pointer',
                        }}
                        onChange={(page) => {
                            setCurrentJobPage(page)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
