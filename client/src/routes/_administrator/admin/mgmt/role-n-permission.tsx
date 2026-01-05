import { INTERNAL_URLS } from '@/lib'
import { AdminPageHeading } from '@/shared/components'
import AdminContentContainer from '@/shared/components/admin/AdminContentContainer'
import { Tab, Tabs } from '@heroui/react'
import {
    createFileRoute,
    Outlet,
    useNavigate,
    useRouterState,
} from '@tanstack/react-router'
import { Key, ShieldCheck, UserCog } from 'lucide-react'

export const Route = createFileRoute(
    '/_administrator/admin/mgmt/role-n-permission'
)({
    component: RolePermissionLayout,
})

function RolePermissionLayout() {
    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    })
    const navigate = useNavigate()

    const activeTab = pathname.split('/')[-1]

    return (
        <div className="size-full">
            <AdminPageHeading title="Role and Permission Access Control" />

            <AdminContentContainer className="pb-10 space-y-2.5">
                <Tabs selectedKey={activeTab} variant="light" color="primary">
                    <Tab
                        key="/"
                        title={
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} />
                                <span>Overview</span>
                            </div>
                        }
                        onClick={() => {
                            navigate({
                                href:
                                    INTERNAL_URLS.roleAndPermissionManage + '/',
                            })
                        }}
                    />
                    <Tab
                        key="roles"
                        title={
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} />
                                <span>Roles</span>
                            </div>
                        }
                        onClick={() => {
                            navigate({
                                href:
                                    INTERNAL_URLS.roleAndPermissionManage +
                                    '/roles',
                            })
                        }}
                    />
                    <Tab
                        key="permissions"
                        title={
                            <div className="flex items-center gap-2">
                                <Key size={16} />
                                <span>Permissions</span>
                            </div>
                        }
                        onClick={() => {
                            navigate({
                                href:
                                    INTERNAL_URLS.roleAndPermissionManage +
                                    '/permissions',
                            })
                        }}
                    />
                    <Tab
                        key="users"
                        title={
                            <div className="flex items-center gap-2">
                                <UserCog size={16} />
                                <span>User Access</span>
                            </div>
                        }
                        onClick={() => {
                            navigate({
                                href:
                                    INTERNAL_URLS.roleAndPermissionManage +
                                    '/users',
                            })
                        }}
                    />
                </Tabs>
                <Outlet />
            </AdminContentContainer>
        </div>
    )
}
