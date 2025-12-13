import { useUsers } from '@/lib/queries'
import { useDisclosure } from '@heroui/react'
import { CreateUserModal } from '../modals/CreateUserModal'
import UserTable from './UserTable'

export default function UserTableView() {
    const {
        data: users,
        refetch: onRefresh,
        isLoading: loadingUsers,
    } = useUsers()
    const {
        isOpen: isOpenUserModal,
        onOpen: onOpenUserModal,
        onClose: onCloseUserModal,
    } = useDisclosure({
        id: 'CreateUserModal',
    })

    return (
        <>
            {isOpenUserModal && (
                <CreateUserModal
                    isOpen={isOpenUserModal}
                    onClose={onCloseUserModal}
                />
            )}

            <UserTable
                data={users}
                visibleColumns={'all'}
                onPageChange={() => {}}
                isLoading={loadingUsers}
                onRefresh={onRefresh}
                openFilterDrawer={() => {}}
                openViewColDrawer={() => {}}
                onRowPerPageChange={() => {}}
                page={1}
                onOpenCreateUserModal={onOpenUserModal}
                totalPages={1}
                rowPerPage={10}
            />
        </>
    )
}
