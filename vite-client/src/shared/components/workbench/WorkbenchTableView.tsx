import type { TJob } from '@/shared/types'
import { useDisclosure } from '@heroui/react'
import lodash from 'lodash'
import { useState } from 'react'
import JobDetailDrawer from '../job-detail/JobDetailDrawer'
import AssignMemberModal from '../project-center/AssignMemberModal'
import WorkbenchTable from './WorkbenchTable'
import { DeliverJobModal } from '../modals/DeliverJobModal'
import { AccountingFinishModal } from '../modals/AccoutingFinishModal'

type Pagination = {
    page: number
    totalPages: number
    limit: number
}
export type WorkbenchTableViewProps = {
    data: TJob[]
    isDataLoading?: boolean
    onRefresh: () => void
    pagination: Pagination
    sort: string
    search?: string
    onSearchChange: (newSearch?: string) => void
    onPageChange: (newPage: number) => void
    onSortChange: (newSort: string) => void
    onLimitChange: (newLimit: number) => void
}

export default function WorkbenchTableView(props: WorkbenchTableViewProps) {
    const [viewDetailNo, setViewDetailNo] = useState<string | null>(null)
    const [assignMemberTo, setAssignMemberTo] = useState<string | null>(null)

    const {
        isOpen: isOpenJobDetailDrawer,
        onOpen: onOpenJobDetailDrawer,
        onClose: onCloseJobDetailDrawer,
    } = useDisclosure({ id: 'JobDetailDrawer' })
    const {
        isOpen: isOpenAssignMemberModal,
        onOpen: onOpenAssignMemberModal,
        onClose: onCloseAssignMemberModal,
    } = useDisclosure({ id: 'AssignMemberModal' })

    const onViewDetail = (jobNo: string) => {
        setViewDetailNo(jobNo)
        onOpenJobDetailDrawer()
    }

    const onAssignMember = (jobNo: string) => {
        setAssignMemberTo(jobNo)
        onOpenAssignMemberModal()
    }

    return (
        <>
            <WorkbenchTable
                onViewDetail={onViewDetail}
                onAssignMember={onAssignMember}
                {...props}
            />

            {isOpenJobDetailDrawer && viewDetailNo && (
                <JobDetailDrawer
                    jobNo={viewDetailNo}
                    isOpen={isOpenJobDetailDrawer}
                    onClose={() => {
                        onCloseJobDetailDrawer()
                        setViewDetailNo(null)
                    }}
                />
            )}

            {isOpenAssignMemberModal && !lodash.isNull(assignMemberTo) && (
                <AssignMemberModal
                    jobNo={assignMemberTo}
                    isOpen={isOpenAssignMemberModal}
                    onClose={() => {
                        onCloseAssignMemberModal()
                        setAssignMemberTo(null)
                    }}
                />
            )}
        </>
    )
}
