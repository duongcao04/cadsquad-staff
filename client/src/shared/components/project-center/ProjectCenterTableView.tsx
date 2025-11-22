'use client'

import { useJobColumns, useJobs } from '@/lib/queries'
import { useDisclosure } from '@heroui/react'
import { FilterDrawer } from './FilterDrawer'
import ProjectCenterTable from './ProjectCenterTable'
import { ViewColumnsDrawer } from './ViewColumnsDrawer'

export default function ProjectCenterTableView() {
    const { projects } = useJobs()
    const { jobColumns: showColumns } = useJobColumns()

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

            <ProjectCenterTable
                data={projects}
                visibleColumns={showColumns}
                openFilterDrawer={onOpenFilterDrawer}
                openViewColDrawer={onOpenViewColDrawer}
            />
        </>
    )
}
