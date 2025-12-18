import { usersListOptions } from '@/lib/queries/options/user-queries'
import { AdminPageHeading } from '@/shared/components/admin/AdminPageHeading'
import { Badge } from '@heroui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet } from '@tanstack/react-router'

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

    return (
        <>
            <AdminPageHeading
                title={
                    <Badge
                        content={total}
                        size="sm"
                        color="danger"
                        variant="solid"
                        classNames={{
                            badge: '-right-1 top-1 text-[10px]! font-bold!',
                        }}
                    >
                        Staff Directory
                    </Badge>
                }
            />
            <Outlet />
        </>
    )
}
