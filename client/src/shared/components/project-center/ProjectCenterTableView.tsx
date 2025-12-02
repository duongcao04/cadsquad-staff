'use client'

import { useJobColumns, useJobs } from '@/lib/queries'
import { useDisclosure } from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import { pCenterTableStore } from '../../stores'
import JobDetailDrawer from '../job-detail/JobDetailDrawer'
import { FilterDrawer } from './FilterDrawer'
import ProjectCenterTable from './ProjectCenterTable'
import { ViewColumnsDrawer } from './ViewColumnsDrawer'

export default function ProjectCenterTableView() {
    const { data: jobs } = useJobs()

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
                visibleColumns={showColumns}
                openFilterDrawer={onOpenFilterDrawer}
                openViewColDrawer={onOpenViewColDrawer}
                openJobDetailDrawer={onOpenJobDetailDrawer}
            />
        </>
    )
}
