import { lightenHexColor } from '@/lib'
import { rolesListOptions } from '@/lib/queries/options/role-queries'
import CreateRoleModal from '@/shared/components/role-and-permission/CreateRoleModal'
import { Button, Card, CardBody, Chip, useDisclosure } from '@heroui/react'
import { useSuspenseQueries } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Edit3, Plus, Trash2 } from 'lucide-react'

export const Route = createFileRoute(
    '/_administrator/admin/mgmt/role-n-permission/roles/'
)({
    component: RolesPage,
})

export default function RolesPage() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    const [
        {
            data: { roles },
        },
    ] = useSuspenseQueries({ queries: [{ ...rolesListOptions() }] })

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Roles Management</h1>
                <Button
                    onPress={onOpen}
                    color="primary"
                    startContent={<Plus size={18} />}
                    className="font-bold shadow-lg shadow-primary/20"
                >
                    Create New Role
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => (
                    <Card
                        key={role.id}
                        className="border-divider shadow-sm hover:border-primary/50 transition-colors"
                    >
                        <CardBody className="p-5 flex flex-row justify-between items-center">
                            <div className="space-y-1">
                                <Chip
                                    style={{
                                        backgroundColor: lightenHexColor(
                                            role.hexColor,
                                            85
                                        ),
                                        color: role.hexColor,
                                    }}
                                    variant="flat"
                                    size="sm"
                                    className="font-bold"
                                >
                                    {role.displayName}
                                </Chip>
                                <p className="text-xs text-text-subdued">
                                    {role.permissions.length} active permissions
                                </p>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onPress={() =>
                                        navigate({
                                            to: `/admin/mgmt/role-n-permission/roles/${role.displayName.toLowerCase()}`,
                                        })
                                    }
                                >
                                    <Edit3 size={16} />
                                </Button>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    color="danger"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Tích hợp Modal */}
            <CreateRoleModal
                isOpen={isOpen}
                onClose={onClose}
                allPermissions={[]} // Truyền danh sách permission từ API của bạn
            />
        </div>
    )
}
