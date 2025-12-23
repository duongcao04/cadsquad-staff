import { excelApi, jobApi } from '@/lib/api'
import { JOB_COLUMNS } from '@/lib/utils'
import { TDownloadExcelInput, TJobFiltersInput } from '@/lib/validationSchemas'
import { useDisclosure } from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import lodash from 'lodash'
import { useState } from 'react'
import { Route } from '../../../routes/_workspace/project-center/$tab'
import { pCenterTableStore } from '../../stores'
import { JobColumnKey, TJob } from '../../types'
import JobDetailDrawer from '../job-detail/JobDetailDrawer'
import AddAttachmentsModal from './AddAttachmentsModal'
import AssignMemberModal from './AssignMemberModal'
import ProjectCenterTable from './ProjectCenterTable'
import { ViewColumnsDrawer } from './ViewColumnsDrawer'
import { JobFilterDrawer } from './JobFilterDrawer'
import { useSuspenseQuery } from '@tanstack/react-query'
import { jobStatusesListOptions, usersListOptions } from '../../../lib/queries'
import { jobTypesListOptions } from '../../../lib/queries/options/job-type-queries'
import { paymentChannelsListOptions } from '../../../lib/queries/options/payment-channel-queries'

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
export default function ProjectCenterTableView(
    props: ProjectCenterTableViewProps
) {
    const search = Route.useSearch()
    const { tab } = Route.useParams()

    const {
        data: { jobStatuses },
    } = useSuspenseQuery({
        ...jobStatusesListOptions(),
    })

    const {
        data: { jobTypes },
    } = useSuspenseQuery({
        ...jobTypesListOptions(),
    })

    const {
        data: { paymentChannels },
    } = useSuspenseQuery({
        ...paymentChannelsListOptions(),
    })

    const {
        data: { users },
    } = useSuspenseQuery({
        ...usersListOptions(),
    })

    const [assignMemberTo, setAssignMemberTo] = useState<string | null>(null)
    const [insertAttachmentsTo, setInsertAttachmentsTo] = useState<
        string | null
    >(null)

    const viewDetail = useStore(pCenterTableStore, (state) => state.viewDetail)
    const jobColumns = useStore(pCenterTableStore, (state) => state.jobColumns)

    // --- DRAWERS & MODALS ---
    const {
        isOpen: isOpenFilterDrawer,
        onOpenChange: onFilterDrawerChange,
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
    const {
        isOpen: isOpenAttachmentsModal,
        onOpen: onOpenAttachmentsModal,
        onClose: onCloseAttachmentsModal,
    } = useDisclosure({
        id: 'AddAttachmentsModal',
    })

    const onAssignMember = (jobNo: string) => {
        setAssignMemberTo(jobNo)
        onOpenAssignMemberModal()
    }

    const handleAddAttachments = (jobNo: string) => {
        setInsertAttachmentsTo(jobNo)
        onOpenAttachmentsModal()
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
    const filterOptions = {
        statuses: (() =>
            jobStatuses.map((item) => ({
                label: item.displayName,
                value: item.code,
            })))(),
        types: (() =>
            jobTypes.map((item) => ({
                label: item.displayName,
                value: item.code,
            })))(),
        assignees: (() =>
            users.map((item) => ({
                label: item.displayName,
                value: item.username,
            })))(),
        paymentChannels: (() =>
            paymentChannels.map((item) => ({
                label: item.displayName,
                value: item.id,
            })))(),
    }
    return (
        <>
            {isOpenFilterDrawer && (
                <JobFilterDrawer
                    isOpen={isOpenFilterDrawer}
                    onOpenChange={onFilterDrawerChange}
                    onApply={(filters) => {
                        console.log(filters)
                    }}
                    options={filterOptions}
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
                    jobNo={assignMemberTo}
                    isOpen={isOpenAssignMemberModal}
                    onClose={onCloseAssignMemberModal}
                />
            )}
            {isOpenAttachmentsModal && !lodash.isNull(insertAttachmentsTo) && (
                <AddAttachmentsModal
                    jobNo={insertAttachmentsTo}
                    isOpen={isOpenAttachmentsModal}
                    onClose={onCloseAttachmentsModal}
                />
            )}

            <ProjectCenterTable
                visibleColumns={jobColumns}
                onAssignMember={onAssignMember}
                onDownloadCsv={handleExport}
                openFilterDrawer={onOpenFilterDrawer}
                openViewColDrawer={onOpenViewColDrawer}
                openJobDetailDrawer={onOpenJobDetailDrawer}
                onAddAttachments={handleAddAttachments}
                {...props}
            />
        </>
    )
}
