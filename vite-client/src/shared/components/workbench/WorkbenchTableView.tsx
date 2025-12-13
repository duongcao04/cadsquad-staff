import { useJobs } from '@/lib/queries'
import { useDisclosure } from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import lodash from 'lodash'
import { useEffect, useState } from 'react'
import { useSearchParam } from '../../hooks'
import { workbenchStore } from '../../stores'
import JobDetailDrawer from '../job-detail/JobDetailDrawer'
import AssignMemberModal from '../project-center/AssignMemberModal'
import WorkbenchTable from './WorkbenchTable'

export default function WorkbenchTableView() {
    const { getSearchParam, setSearchParams } = useSearchParam()

    const [viewDetailNo, setViewDetailNo] = useState<string | null>(null)
    const [assignMemberTo, setAssignMemberTo] = useState<string | null>(null)

    const [sortString, setSortString] = useState<string | null>(() => {
        return getSearchParam('sort') || null
    })

    useEffect(() => {
        setSearchParams({ sort: sortString })
    }, [sortString])

    const searchKeywords = useStore(
        workbenchStore,
        (state) => state.searchKeywords
    )
    const { jobs } = useJobs({
        search: searchKeywords,
        sort: sortString ?? undefined,
    })

    const {
        isOpen: isOpenJobDetailDrawer,
        onOpen: onOpenJobDetailDrawer,
        onClose: onCloseJobDetailDrawer,
    } = useDisclosure({
        id: 'JobDetailDrawer',
    })
    const {
        isOpen: isOpenAssignMemberModal,
        onOpen: onOpenAssignMemberModal,
        onClose: onCloseAssignMemberModal,
    } = useDisclosure({
        id: 'AssignMemberModal',
    })

    // Update searchKeywords state when change
    const existSearchKeywords = getSearchParam('q')
    useEffect(() => {
        if (existSearchKeywords) {
            workbenchStore.setState((state) => ({
                ...state,
                searchKeywords: existSearchKeywords,
            }))
            return
        }
    }, [existSearchKeywords])

    // Update searchKeywords state when change
    useEffect(() => {
        setSearchParams({ q: searchKeywords })
    }, [searchKeywords])

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
            {viewDetailNo && (
                <JobDetailDrawer
                    jobNo={viewDetailNo}
                    isOpen={Boolean(viewDetailNo) && isOpenJobDetailDrawer}
                    onClose={() => {
                        onCloseJobDetailDrawer()
                        setAssignMemberTo(null)
                    }}
                />
            )}
            {assignMemberTo && (
                <AssignMemberModal
                    jobNo={assignMemberTo}
                    isOpen={
                        !lodash.isNull(assignMemberTo) &&
                        isOpenAssignMemberModal
                    }
                    onClose={onCloseAssignMemberModal}
                />
            )}
            <WorkbenchTable
                data={jobs}
                onViewDetail={onViewDetail}
                onAssignMember={onAssignMember}
                sortString={sortString}
                setSortString={setSortString}
            />
        </>
    )
}
