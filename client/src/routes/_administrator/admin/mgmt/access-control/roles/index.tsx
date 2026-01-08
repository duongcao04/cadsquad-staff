import {
    permissionGroupsListOptions,
    rolesListOptions,
} from '@/lib/queries/options/role-queries'
import CreateRoleModal from '@/shared/components/role-and-permission/CreateRoleModal'
import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Card,
    CardBody,
    Chip,
    useDisclosure,
} from '@heroui/react'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { AddRoleMemberModal } from '../../../../../../shared/components/role-and-permission/AddRoleMemberModal'
import { useState } from 'react'
import { TRole } from '../../../../../../shared/types'
import { useAddMemberToRoleMutation } from '../../../../../../lib/queries/useRole'

export const Route = createFileRoute(
    '/_administrator/admin/mgmt/access-control/roles/'
)({
    component: RolesPage,
})

export default function RolesPage() {
    const navigate = useNavigate()
    const router = useRouter()

    const addMemberToRoleMutation = useAddMemberToRoleMutation()
    const [roleSelected, setRoleSelected] = useState<TRole | null>(null)

    const [
        {
            data: { roles },
        },
        { data: permissions },
    ] = useSuspenseQueries({
        queries: [
            { ...rolesListOptions() },
            { ...permissionGroupsListOptions() },
        ],
    })

    const addRoleMemberModalDisclosure = useDisclosure({
        id: 'AddRoleMemberModal',
    })
    const createRoleModalDisclosure = useDisclosure()

    const handleAddRoleMember = (role: TRole) => {
        setRoleSelected(role)
        addRoleMemberModalDisclosure.onOpen()
    }

    const handleConfirmAddMemberToRole = async (
        userId: string,
        roleId: string
    ) => {
        // Gọi mutation
        await addMemberToRoleMutation.mutateAsync({
            roleId,
            userId,
        })
    }

    return (
        <>
            {addRoleMemberModalDisclosure.isOpen && roleSelected && (
                <AddRoleMemberModal
                    isOpen={addRoleMemberModalDisclosure.isOpen}
                    onClose={addRoleMemberModalDisclosure.onClose}
                    onConfirm={handleConfirmAddMemberToRole}
                    role={roleSelected}
                />
            )}
            {createRoleModalDisclosure.isOpen && (
                <CreateRoleModal
                    isOpen={createRoleModalDisclosure.isOpen}
                    onClose={createRoleModalDisclosure.onClose}
                    allPermissions={permissions}
                />
            )}
            <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
                <Breadcrumbs variant="light">
                    <BreadcrumbItem
                        onPress={() =>
                            router.navigate({
                                href: '..',
                            })
                        }
                    >
                        Access Control
                    </BreadcrumbItem>
                    <BreadcrumbItem>Roles Manage</BreadcrumbItem>
                </Breadcrumbs>
                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {roles.map((role) => (
                        <Card
                            key={role.id}
                            shadow="sm"
                            className="border-none p-2"
                        >
                            <CardBody className="space-y-6">
                                {/* Role Title & Member Count */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">
                                            {role.displayName}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-medium mt-1">
                                            Scope:{' '}
                                            <span className="text-slate-500">
                                                Organization
                                            </span>
                                        </p>
                                    </div>
                                    <Chip
                                        variant="flat"
                                        className="h-8 px-4 font-bold bg-slate-100 text-text-default rounded-lg"
                                    >
                                        {role.users?.length || 0} Member
                                        {role.users?.length >= 2 ? 's' : ''}
                                    </Chip>
                                </div>

                                {/* Role Description - Fallback if not in schema */}
                                <p className="text-sm text-slate-600 leading-relaxed min-h-12">
                                    {
                                        'Full access to manage members, billing, and organization-wide settings.'
                                    }
                                </p>

                                {/* Action Buttons */}
                                <div className="flex justify-between items-center pt-2">
                                    <Button
                                        variant="bordered"
                                        size="sm"
                                        className="font-bold border-slate-200"
                                        onPress={() =>
                                            navigate({ to: `${role.code}` })
                                        }
                                    >
                                        View Managers
                                    </Button>
                                    <Button
                                        variant="bordered"
                                        color="primary"
                                        size="sm"
                                        className="font-bold border-indigo-200 text-indigo-600"
                                        onPress={() =>
                                            handleAddRoleMember(role)
                                        }
                                    >
                                        Add New{' '}
                                        {role.displayName.replace(' Admin', '')}
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}

                    {/* Create New Role Dotted Card */}
                    <Card
                        isPressable
                        onPress={createRoleModalDisclosure.onOpen}
                        shadow="none"
                        className="border-2 border-dashed border-border-default bg-transparent flex justify-center items-center p-8 hover:bg-background-muted hover:border-indigo-300 transition-all"
                    >
                        <CardBody className="flex flex-col items-center justify-center gap-4">
                            <div className="p-3 rounded-full border-2 border-border-default text-text-subdued">
                                <Plus size={24} />
                            </div>
                            <Button
                                variant="bordered"
                                className="bg-background font-bold border border-border-default text-text-default"
                                onPress={createRoleModalDisclosure.onOpen}
                            >
                                Create New Role
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    )
}
