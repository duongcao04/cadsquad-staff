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

export type DataType = Job & {
    key: React.Key
}
export default function OnboardingPage() {
    const { refetch: refreshJob, isLoading: loadingJobs } = useJobs()
    const { getSearchParam, setSearchParams, removeSearchParam } =
        useSearchParam()
    const tabQuery = getSearchParam('tab') ?? 'priority'

    const [currentTab, setCurrentTab] = useState(tabQuery)

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
                {/* <ConfirmModal
                    isOpen={deleteModal.isOpen}
                    onClose={deleteModal.onClose}
                    isLoading={isDeletingJob}
                    onConfirm={async () => {
                        try {
                            if (deleteJob) {
                                await deleteJobMutate(
                                    deleteJob.id?.toString() as string
                                )
                                addToast({
                                    title: 'Xóa dự án thành công',
                                    color: 'success',
                                })
                            }
                            return
                        } catch (error) {
                            addToast({
                                title: 'Xóa dự án thất bại',
                                description: `${JSON.stringify(error)}`,
                                color: 'danger',
                            })
                        }
                    }}
                    variant="danger"
                    title={`Delete ${deleteJob?.jobNo}`}
                    message={
                        <div className="flex flex-col items-center">
                            <p className="text-base font-semibold">
                                Are you sure you want to delete this job?
                            </p>
                            <p className="mt-3 text-sm text-center">
                                This action will mark the job as deleted. You
                                can restore it later if needed.
                            </p>
                            <p className="text-sm text-center">
                                P/s: Deleted jobs will move to cancelled
                            </p>
                        </div>
                    }
                    confirmText="Delete"
                /> */}
                <JobTableTabs
                    activeKey={currentTab}
                    onChange={handleTabChange}
                />
                <div className="flex items-center justify-between gap-5">
                    <div className="grid grid-cols-[350px_90px_1fr] gap-3">
                        <Input
                            // value={keywords}
                            startContent={<Search size={18} />}
                            classNames={{
                                inputWrapper:
                                    'shadow-none border border-text3 bg-background',
                            }}
                            // onChange={(event) => {
                            //     const value = event.target.value
                            //     setKeywords(value)
                            //     setSearchParams({ search: value })
                            // }}
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
                            onPress={() => refreshJob()}
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
                    className="mt-4 size-full p-2 bg-background"
                    style={{
                        borderRadius: '20px',
                    }}
                >
                    <JobTable currentTab={currentTab} />
                </div>
            </div>
        </div>
    )
}
