'use client'

import { excelApi } from '@/lib/api'
import { useJobColumns, useJobs } from '@/lib/queries'
import { JOB_COLUMNS, STORAGE_KEYS } from '@/lib/utils'
import { TDownloadExcelInput } from '@/lib/validationSchemas'
import { useDisclosure } from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import { useLocalStorage } from 'usehooks-ts'
import { pCenterTableStore } from '../../stores'
import { JobColumnKey } from '../../types'
import JobDetailDrawer from '../job-detail/JobDetailDrawer'
import { FilterDrawer } from './FilterDrawer'
import ProjectCenterTable from './ProjectCenterTable'
import { ViewColumnsDrawer } from './ViewColumnsDrawer'

export default function ProjectCenterTableView() {
    const [localShowFinishItems, setLocalShowFinishItems] = useLocalStorage(
        STORAGE_KEYS.projectCenterFinishItems,
        false
    )

    const {
        data: jobs,
        isLoading: isJobLoadings,
        refetch: onRefresh,
    } = useJobs({
        hideFinishItems: localShowFinishItems ? 1 : 0,
    })

    const { jobColumns: showColumns } = useJobColumns()

    const viewDetail = useStore(pCenterTableStore, (state) => state.viewDetail)

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

            <ProjectCenterTable
                data={jobs}
                isLoading={isJobLoadings}
                visibleColumns={showColumns}
                showFinishItems={localShowFinishItems}
                onRefresh={onRefresh}
                onDownloadCsv={handleExport}
                onShowFinishItemsChange={setLocalShowFinishItems}
                openFilterDrawer={onOpenFilterDrawer}
                openViewColDrawer={onOpenViewColDrawer}
                openJobDetailDrawer={onOpenJobDetailDrawer}
            />
        </>
    )
}
