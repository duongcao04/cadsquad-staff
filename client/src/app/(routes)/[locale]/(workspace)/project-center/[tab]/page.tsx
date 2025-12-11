'use client'

import ProjectCenterTableView from '@/shared/components/project-center/ProjectCenterTableView'
import TableContextMenu from '@/shared/components/project-center/TableContextMenu'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { projectCenterStore } from '@/shared/stores'
import React, { use, useEffect } from 'react'

export default function ProjectCenterTabPage({
    params,
}: {
    params: Promise<{ tab: string }>
}) {
    // Unwrap params using React 19 'use' API
    const { tab } = use(params)

    // OPTIONAL: Only sync 'tab' to global store if your Sidebar/Header needs it.
    // We DO NOT sync 'searchParams' here anymore because the TableView reads
    // them directly from the URL. This prevents "Double Source of Truth" bugs.
    useEffect(() => {
        projectCenterStore.setState((state) => ({
            ...state,
            tab: tab as unknown as ProjectCenterTabEnum,
        }))
    }, [tab])

    return (
        <div className="py-3 size-full max-h-[calc(100%-150px)]">
            <TableContextMenu>
                {/* Pass tab to view so it can filter API calls by Active/Finished/etc */}
                <ProjectCenterTableView tab={projectCenterStore.state.tab} />
            </TableContextMenu>
        </div>
    )
}
