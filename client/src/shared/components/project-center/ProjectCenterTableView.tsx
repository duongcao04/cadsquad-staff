'use client'

import { excelApi } from '@/lib/api'
import { useJobColumns, useJobs } from '@/lib/queries'
import { safeArray, safeISODate, safeString } from '@/lib/query-string'
import { JOB_COLUMNS, STORAGE_KEYS } from '@/lib/utils'
import { TDownloadExcelInput, TJobFiltersInput } from '@/lib/validationSchemas'
import { useDisclosure } from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import { useDebounce } from 'hooks-ts'
import lodash from 'lodash'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useSearchParam } from '../../hooks'
import { pCenterTableStore, projectCenterStore } from '../../stores'
import { JobColumnKey } from '../../types'
import JobDetailDrawer from '../job-detail/JobDetailDrawer'
import AssignMemberModal from './AssignMemberModal'
import { FilterDrawer } from './FilterDrawer'
import ProjectCenterTable from './ProjectCenterTable'
import { ViewColumnsDrawer } from './ViewColumnsDrawer'
import { ProjectCenterTabEnum } from '../../enums'

type ProjectCenterTableViewProps = {
    tab: ProjectCenterTabEnum
}
export default function ProjectCenterTableView({
    tab = ProjectCenterTabEnum.PRIORITY,
}: ProjectCenterTableViewProps) {
    const { getSearchParam, setSearchParams } = useSearchParam()

    const [assignMemberTo, setAssignMemberTo] = useState<string | null>(null)

    const [filters, setFilters] = useState<TJobFiltersInput>({
        clientName: getSearchParam('clientName') || '',
        status: safeArray(getSearchParam('status')),
        type: safeArray(getSearchParam('type')),
        assignee: safeArray(getSearchParam('assignee')),
        paymentChannel: safeArray(getSearchParam('paymentChannel')),

        createdAtFrom: safeISODate(getSearchParam('createdAtFrom')),
        createdAtTo: safeISODate(getSearchParam('createdAtTo')),
        dueAtFrom: safeISODate(getSearchParam('dueAtFrom')),
        dueAtTo: safeISODate(getSearchParam('dueAtTo')),
        completedAtFrom: safeISODate(getSearchParam('completedAtFrom')),
        completedAtTo: safeISODate(getSearchParam('completedAtTo')),
        finishedAtFrom: safeISODate(getSearchParam('finishedAtFrom')),
        finishedAtTo: safeISODate(getSearchParam('finishedAtTo')),

        incomeCostMin: safeString(getSearchParam('incomeCostMin')),
        incomeCostMax: safeString(getSearchParam('incomeCostMax')),
        staffCostMin: safeString(getSearchParam('staffCostMin')),
        staffCostMax: safeString(getSearchParam('staffCostMax')),
    })

    // --- 1. SORTING (URL is Single Source of Truth) ---
    // We read directly from the URL. No local state needed for sort.
    // This ensures the back button works and we don't accidentally overwrite the URL.
    const sortString = getSearchParam('sort') || undefined

    const handleSortChange = (newSort: string) => {
        setSearchParams({ sort: newSort })
    }

    // --- 2. SEARCH (Local State + Debounce -> URL) ---
    // We initialize from URL so a refresh keeps the search.
    // We keep local state so the Input field is responsive (no typing lag).
    const [searchKeywords, setSearchKeywords] = useState<string | undefined>(
        () => getSearchParam('k') || ''
    )

    // Debounce the LOCAL value (wait 500ms after typing stops)
    const searchDebounced = useDebounce(searchKeywords, 500)

    // Sync Debounced Value -> URL
    useEffect(() => {
        // Only update if the URL value is different to avoid redundant pushes
        const currentUrlK = getSearchParam('k')
        if (searchDebounced !== currentUrlK) {
            setSearchParams({ k: searchDebounced || undefined }) // undefined removes the param
        }
    }, [searchDebounced, getSearchParam, setSearchParams])

    const [localShowFinishItems, setLocalShowFinishItems] = useLocalStorage(
        STORAGE_KEYS.projectCenterFinishItems,
        false
    )

    const pagination = useStore(projectCenterStore, (state) => ({
        rowPerPage: state.limit,
        page: state.page,
        totalPages: 10,
    }))

    const {
        data: jobs,
        isLoading: isJobLoadings,
        paginate,
        refetch: onRefresh,
    } = useJobs({
        // Paginate
        tab: tab,
        limit: pagination.rowPerPage,
        page: pagination.page,
        // Filters
        status: filters.status,
        dueAtFrom: filters.dueAtFrom,
        dueAtTo: filters.dueAtTo,
        search: searchDebounced ?? undefined,
        sort: sortString ?? undefined,
        hideFinishItems: localShowFinishItems ? '1' : '0',
    })

    const { jobColumns: showColumns } = useJobColumns()

    const viewDetail = useStore(pCenterTableStore, (state) => state.viewDetail)

    // --- DRAWERS & MODALS ---
    const {
        isOpen: isOpenFilterDrawer,
        onClose: onCloseFilterDrawer,
        onOpen: onOpenFilterDrawer,
    } = useDisclosure({ id: 'FilterDrawer' })
    const {
        isOpen: isOpenViewColDrawer,
        onClose: onCloseViewColDrawer,
        onOpen: onOpenViewColDrawer,
    } = useDisclosure({ id: 'ViewColumnDrawer' })
    const {
        isOpen: isOpenJobDetailDrawer,
        onClose: onCloseJobDetailDrawer,
        onOpen: onOpenJobDetailDrawer,
    } = useDisclosure({ id: 'JobDetailDrawer' })
    const {
        isOpen: isOpenAssignMemberModal,
        onOpen: onOpenAssignMemberModal,
        onClose: onCloseAssignMemberModal,
    } = useDisclosure({
        id: 'AssignMemberModal',
    })

    const onAssignMember = (jobNo: string) => {
        setAssignMemberTo(jobNo)
        onOpenAssignMemberModal()
    }

    const handleExport = async () => {
        try {
            const showColumns: JobColumnKey[] = [
                'no',
                'displayName',
                'clientName',
                'assignee',
                'incomeCost',
                'staffCost',
                'type',
                'status',
                'dueAt',
                'completedAt',
                'createdAt',
                'updatedAt',
                'isPaid',
                'paymentChannel',
            ]

            const payload: TDownloadExcelInput = {
                columns: JOB_COLUMNS.filter((item) =>
                    showColumns.includes(item.uid)
                ).map((col) => ({
                    header: col.displayName,
                    key: col.uid,
                })),
                data: jobs.map((item) => {
                    return {
                        no: item.no,
                        displayName: item.displayName,
                        clientName: item.clientName,
                        assignee: item.assignee
                            .map((item) => item.displayName)
                            .join(', '),
                        incomeCost: item.incomeCost,
                        staffCost: item.staffCost,
                        type: item.type.displayName,
                        status: item.status.displayName,
                        dueAt: item.dueAt,
                        completedAt: item.completedAt,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                        isPaid: item.isPaid ? 'Yes' : 'No',
                        paymentChannel: item.paymentChannel?.displayName,
                    }
                }),
            }

            const response = await excelApi.download(payload)

            // Create a URL for the blob and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'export_data.xlsx') // Filename
            document.body.appendChild(link)
            link.click()

            // Cleanup
            link.parentNode?.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Download failed', error)
        }
    }

    return (
        <>
            <FilterDrawer
                isOpen={isOpenFilterDrawer}
                onClose={onCloseFilterDrawer}
                filters={filters}
                onFiltersChange={setFilters}
            />
            <ViewColumnsDrawer
                isOpen={isOpenViewColDrawer}
                onClose={onCloseViewColDrawer}
            />
            <JobDetailDrawer
                isOpen={isOpenJobDetailDrawer}
                onClose={onCloseJobDetailDrawer}
                jobNo={viewDetail}
            />
            <AssignMemberModal
                jobNo={assignMemberTo ?? ''}
                isOpen={
                    !lodash.isNull(assignMemberTo) && isOpenAssignMemberModal
                }
                onClose={onCloseAssignMemberModal}
            />

            <ProjectCenterTable
                data={jobs}
                isLoading={isJobLoadings}
                visibleColumns={showColumns}
                showFinishItems={localShowFinishItems}
                onRefresh={onRefresh}
                sortString={sortString}
                onAssignMember={onAssignMember}
                onSortStringChange={handleSortChange}
                searchKeywords={searchKeywords}
                onSearchKeywordsChange={setSearchKeywords}
                onDownloadCsv={handleExport}
                filters={filters}
                currentPage={paginate?.page}
                totalPages={paginate?.totalPages}
                onFiltersChange={setFilters}
                onShowFinishItemsChange={setLocalShowFinishItems}
                openFilterDrawer={onOpenFilterDrawer}
                openViewColDrawer={onOpenViewColDrawer}
                openJobDetailDrawer={onOpenJobDetailDrawer}
            />
        </>
    )
}
