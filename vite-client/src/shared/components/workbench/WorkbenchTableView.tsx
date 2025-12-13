import { useDisclosure } from '@heroui/react'
import lodash from 'lodash'
import { useState } from 'react'

import JobDetailDrawer from '../job-detail/JobDetailDrawer'
import AssignMemberModal from '../project-center/AssignMemberModal'
import WorkbenchTable from './WorkbenchTable'
import type { TJob } from '@/shared/types'
import { Route, TWorkbenchSearch } from '../../../routes/_workspace/_workbench'
import { useNavigate } from '@tanstack/react-router'

type WorkbenchTableViewProps = {
    data: TJob[]
    // Nên truyền thêm pagination info nếu cần phân trang
    pagination?: { total: number; page: number; limit: number }
}

export default function WorkbenchTableView({ data }: WorkbenchTableViewProps) {
    const navigate = useNavigate({ from: '/' })

    // 1. Lấy state trực tiếp từ URL (Type-safe)
    const params = Route.useSearch()

    const [viewDetailNo, setViewDetailNo] = useState<string | null>(null)
    const [assignMemberTo, setAssignMemberTo] = useState<string | null>(null)

    // // 2. Hàm xử lý chuyển trang
    // const handlePageChange = (newPage: number) => {
    //     navigate({
    //         search: () => {
    //             return {
    //                 ...params,
    //                 page: newPage,
    //             }
    //         },
    //         replace: true, // Giúp nút Back hoạt động mượt hơn
    //     })
    // }

    // // 3. Hàm xử lý Sort (Truyền xuống WorkbenchTable)
    // const handleSortChange = (newSort: string | null) => {
    //     navigate({
    //         search: (old) => ({
    //             ...old,
    //             // Nếu newSort null thì dùng mảng rỗng hoặc logic mặc định của bạn
    //             sort: newSort ?? undefined,
    //             page: 1, // Reset về trang 1 khi sort thay đổi
    //         }),
    //         replace: true,
    //     })
    // }

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
            {viewDetailNo && (
                <JobDetailDrawer
                    jobNo={viewDetailNo}
                    isOpen={Boolean(viewDetailNo) && isOpenJobDetailDrawer}
                    onClose={() => {
                        onCloseJobDetailDrawer()
                        setViewDetailNo(null)
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
                    onClose={() => {
                        onCloseAssignMemberModal()
                        setAssignMemberTo(null)
                    }}
                />
            )}

            <WorkbenchTable
                data={data}
                onViewDetail={onViewDetail}
                onAssignMember={onAssignMember}
                // 👇 Truyền giá trị từ URL xuống
                // Lưu ý: params.sort có thể là string hoặc array tùy vào Zod Schema bạn định nghĩa
                // Ở đây giả sử Table nhận string
                sortString={params.sort[0]}
                // 👇 Truyền hàm navigate xuống thay vì setState
                setSortString={() => {}}
                // 👇 Truyền hàm pagination xuống
                onPageChange={() => {}}
                currentPage={params.page}
            />
        </>
    )
}
