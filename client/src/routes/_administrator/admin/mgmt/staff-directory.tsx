import { usersListOptions } from '@/lib/queries/options/user-queries'
import { AdminPageHeading } from '@/shared/components/admin/AdminPageHeading'
import { useDisclosure } from '@heroui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { UserRoundPlusIcon } from 'lucide-react'
import { HeroButton } from '../../../../shared/components'
import CreateUserModal from '../../../../shared/components/modals/CreateUserModal'

export const Route = createFileRoute(
    '/_administrator/admin/mgmt/staff-directory'
)({
    component: StaffDirectoryLayout,
})

function StaffDirectoryLayout() {
    const options = usersListOptions()
    const {
        data: { total },
    } = useSuspenseQuery(options)

    const createUserModalDisclosure = useDisclosure({
        id: 'CreateUserModal',
    })

    return (
        <>
            {createUserModalDisclosure.isOpen && (
                <CreateUserModal
                    isOpen={createUserModalDisclosure.isOpen}
                    onClose={createUserModalDisclosure.onClose}
                />
            )}
            <AdminPageHeading
                title="Staff Directory"
                showBadge
                badgeCount={total}
                actions={
                    <HeroButton
                        color="primary"
                        className="px-6"
                        startContent={<UserRoundPlusIcon size={16} />}
                        onPress={createUserModalDisclosure.onOpen}
                    >
                        New Member
                    </HeroButton>
                }
            />
            <Outlet />
        </>
    )
}
