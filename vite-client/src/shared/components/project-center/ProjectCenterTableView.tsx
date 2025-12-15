import { excelApi, jobApi } from '@/lib/api'
import { useJobColumns } from '@/lib/queries'
import { JOB_COLUMNS } from '@/lib/utils'
import { TDownloadExcelInput, TJobFiltersInput } from '@/lib/validationSchemas'
import { useDisclosure } from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import lodash from 'lodash'
import { useState } from 'react'
import { pCenterTableStore } from '../../stores'
import { JobColumnKey, TJob } from '../../types'
import JobDetailDrawer from '../job-detail/JobDetailDrawer'
import AssignMemberModal from './AssignMemberModal'
import { FilterDrawer } from './FilterDrawer'
import ProjectCenterTable from './ProjectCenterTable'
import { ViewColumnsDrawer } from './ViewColumnsDrawer'
import { Route } from '../../../routes/_workspace/project-center/$tab'

type Pagination = {
    page: number
    totalPages: number
    limit: number
    total: number
}
export type ProjectCenterTableViewProps = {
    data: TJob[]
    isLoadingData?: boolean
    filters: TJobFiltersInput
    onFiltersChange: (filters: TJobFiltersInput) => void
    sort?: string
    onSortChange: (sort: string) => void
    searchKeywords?: string
    onSearchKeywordsChange: (searchKeywords: string) => void
    pagination: Pagination
    onRefresh?: () => void
    onLimitChange: (limit: number) => void
    onPageChange: (page: number) => void
    onShowFinishItemsChange: (state: boolean) => void
    showFinishItems: boolean
}
export default function ProjectCenterTableView({
    data,
    isLoadingData = false,
    filters,
    onFiltersChange,
    sort,
    searchKeywords,
    onSortChange,
    onSearchKeywordsChange,
    onRefresh,
    pagination,
    onLimitChange,
    onShowFinishItemsChange,
    onPageChange,
    showFinishItems,
}: ProjectCenterTableViewProps) {
    const search = Route.useSearch()
    const { tab } = Route.useParams()

    const [assignMemberTo, setAssignMemberTo] = useState<string | null>(null)

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

        try {
            const data = (await jobApi
                .findAll({
                    ...search,
                    tab,
                    isAll: '1',
                })
                .then((res) => res.result?.data)) as TJob[]

            const payload: TDownloadExcelInput = {
                columns: JOB_COLUMNS.filter((item) =>
                    showColumns.includes(item.uid)
                ).map((col) => ({
                    header: col.displayName,
                    key: col.uid,
                })),
                data: data.map((item) => {
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
            {isOpenFilterDrawer && (
                <FilterDrawer
                    isOpen={isOpenFilterDrawer}
                    onClose={onCloseFilterDrawer}
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                />
            )}
            {isOpenViewColDrawer && (
                <ViewColumnsDrawer
                    isOpen={isOpenViewColDrawer}
                    onClose={onCloseViewColDrawer}
                />
            )}
            {isOpenJobDetailDrawer && viewDetail && (
                <JobDetailDrawer
                    isOpen={isOpenJobDetailDrawer}
                    onClose={onCloseJobDetailDrawer}
                    jobNo={viewDetail}
                />
            )}
            {isOpenAssignMemberModal && !lodash.isNull(assignMemberTo) && (
                <AssignMemberModal
                    jobNo={assignMemberTo ?? ''}
                    isOpen={isOpenAssignMemberModal}
                    onClose={onCloseAssignMemberModal}
                />
            )}

            <ProjectCenterTable
                data={data}
                isLoadingData={isLoadingData}
                visibleColumns={showColumns}
                showFinishItems={showFinishItems}
                onRefresh={onRefresh}
                sort={sort}
                onAssignMember={onAssignMember}
                onSortChange={onSortChange}
                searchKeywords={searchKeywords}
                onSearchKeywordsChange={onSearchKeywordsChange}
                onDownloadCsv={handleExport}
                filters={filters}
                pagination={pagination}
                onFiltersChange={onFiltersChange}
                onShowFinishItemsChange={onShowFinishItemsChange}
                openFilterDrawer={onOpenFilterDrawer}
                openViewColDrawer={onOpenViewColDrawer}
                openJobDetailDrawer={onOpenJobDetailDrawer}
                onLimitChange={onLimitChange}
                onPageChange={onPageChange}
            />
        </>
    )
}
