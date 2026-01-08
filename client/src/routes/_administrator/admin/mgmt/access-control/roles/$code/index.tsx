import { roleOptions } from '@/lib/queries'
import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Card,
    CardBody,
    Chip,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
    User,
} from '@heroui/react'
import { useSuspenseQueries } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Mail, Settings2, ShieldCheck } from 'lucide-react'

import { INTERNAL_URLS, optimizeCloudinary } from '@/lib'
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@heroui/react'
import { Copy, Edit3, MoreHorizontal, Trash2, UserPlus } from 'lucide-react'
import { HeroTable } from '../../../../../../../shared/components'
import { useState } from 'react'
import { useAddMemberToRoleMutation } from '../../../../../../../lib/queries/useRole'
import { AddRoleMemberModal } from '../../../../../../../shared/components/role-and-permission/AddRoleMemberModal'
import { TRole } from '../../../../../../../shared/types'

export const Route = createFileRoute(
    '/_administrator/admin/mgmt/access-control/roles/$code/'
)({
    component: RoleDetailPage,
})

export default function RoleDetailPage() {
    const router = useRouter()
    const { code } = Route.useParams()
    const [
        {
            data: { role, permissions: rolePermissions },
        },
    ] = useSuspenseQueries({
        queries: [
            {
                ...roleOptions(code),
            },
        ],
    })

    return (
        <div className="p-8 animate-in fade-in duration-500">
            <Breadcrumbs variant="light">
                <BreadcrumbItem
                    onPress={() =>
                        router.navigate({
                            href: '..',
                        })
                    }
                >
                    Roles
                </BreadcrumbItem>
                <BreadcrumbItem>{role.displayName}</BreadcrumbItem>
            </Breadcrumbs>
            {/* Breadcrumbs / Back */}
            <div className="mt-5 flex items-center gap-4">
                <Button
                    isIconOnly
                    variant="flat"
                    radius="full"
                    onPress={() => router.navigate({ href: '..' })}
                >
                    <ArrowLeft size={20} />
                </Button>
                <div className="space-y-1">
                    <h1 className="text-2xl font-black">{role.displayName}</h1>
                    <p className="text-xs text-text-subdued font-bold uppercase tracking-wider">
                        Role Management
                    </p>
                </div>
            </div>

            <div className="mt-7 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Role Stats */}
                <div className="space-y-6">
                    <Card shadow="sm" className="border-none">
                        <CardBody className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                                    style={{ backgroundColor: role.hexColor }}
                                >
                                    <ShieldCheck size={28} />
                                </div>
                                <QuickActionsDropdown role={role} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">
                                    Identity Details
                                </h4>
                                <p className="text-sm text-text-subdued mt-1">
                                    {/* {role.description} */}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Chip
                                    variant="flat"
                                    color="primary"
                                    className="font-bold"
                                >
                                    {rolePermissions.length} Permissions
                                </Chip>
                                <Chip variant="flat" className="font-bold">
                                    Organization Scope
                                </Chip>
                            </div>
                            <Button
                                fullWidth
                                color="primary"
                                variant="flat"
                                startContent={<Settings2 size={18} />}
                                className="font-bold mt-4"
                                onPress={() =>
                                    router.navigate({
                                        href: INTERNAL_URLS.editRolePermMatrix(
                                            code
                                        ),
                                    })
                                }
                            >
                                Edit Permissions Matrix
                            </Button>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Member Table */}
                <div className="lg:col-span-2 space-y-4">
                    <Card shadow="sm" className="border-none">
                        <CardBody className="p-0">
                            <div className="p-6 border-b border-divider flex justify-between items-center">
                                <h3 className="font-bold text-lg">
                                    Assigned Members
                                </h3>
                                <Chip
                                    size="sm"
                                    variant="dot"
                                    color="success"
                                    className="font-bold"
                                >
                                    {role.users.length} Active Users
                                </Chip>
                            </div>
                        </CardBody>
                    </Card>
                    <HeroTable
                        aria-label="Members table"
                        className="bg-background"
                    >
                        <TableHeader>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>CONTACT</TableColumn>
                            <TableColumn align="end">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {role.users.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="hover:bg-default-50 transition-colors"
                                >
                                    <TableCell>
                                        <User
                                            name={user.displayName}
                                            avatarProps={{
                                                src: optimizeCloudinary(
                                                    user.avatar
                                                ),
                                                radius: 'lg',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-default-400">
                                            <Mail size={14} />
                                            <span className="text-xs font-medium">
                                                {user.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="light"
                                            color="danger"
                                            className="font-bold"
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </HeroTable>
                </div>
            </div>
        </div>
    )
}

interface QuickActionsProps {
    onEdit?: () => void
    onDelete?: () => void
    onDuplicate?: () => void
    role: TRole
}

export const QuickActionsDropdown = ({
    onEdit,
    onDelete,
    onDuplicate,
    role,
}: QuickActionsProps) => {
    const addRoleMemberModalDisclosure = useDisclosure({
        id: 'AddRoleMemberModal',
    })
    const [roleSelected, setRoleSelected] = useState<TRole | null>(null)

    const addMemberToRoleMutation = useAddMemberToRoleMutation()

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
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <Button isIconOnly variant="light" radius="full">
                        <MoreHorizontal
                            size={20}
                            className="text-text-subdued"
                        />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Role Actions" variant="flat">
                    <DropdownItem
                        key="edit"
                        startContent={<Edit3 size={16} />}
                        onPress={onEdit}
                    >
                        Edit Role Details
                    </DropdownItem>
                    <DropdownItem
                        key="duplicate"
                        startContent={<Copy size={16} />}
                        onPress={onDuplicate}
                    >
                        Duplicate Role
                    </DropdownItem>
                    <DropdownItem
                        key="assign"
                        startContent={<UserPlus size={16} />}
                        onPress={() => handleAddRoleMember(role)}
                    >
                        Assign to Members
                    </DropdownItem>
                    <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={<Trash2 size={16} />}
                        description={`Permanently remove ${role.displayName}`}
                        onPress={onDelete}
                    >
                        Delete Role
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}
