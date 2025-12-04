import { useUsers } from '@/lib/queries'
import { useDisclosure } from '@heroui/react'
import { CreateUserModal } from '../modals'
import UserTable from './UserTable'

export default function UserTableView() {
    const { data: users } = useUsers()
    const {
        isOpen: isOpenUserModal,
        onOpen: onOpenUserModal,
        onClose: onCloseUserModal,
    } = useDisclosure({
        id: 'CreateUserModal',
    })

    return (
        <>
            <CreateUserModal
                isOpen={isOpenUserModal}
                onClose={onCloseUserModal}
            />
            <UserTable
                data={users}
                visibleColumns={'all'}
                onPageChange={() => {}}
                onRefresh={() => {}}
                openFilterDrawer={() => {}}
                openViewColDrawer={() => {}}
                onRowPerPageChange={() => {}}
                page={1}
                totalPages={1}
                rowPerPage={10}
            />
        </>
    )
}
