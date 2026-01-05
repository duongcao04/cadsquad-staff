import { createFileRoute } from '@tanstack/react-router'
import { PlusIcon, TrashIcon, ShieldCheckIcon, SearchIcon } from 'lucide-react'
import {
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Chip,
    Tooltip,
    useDisclosure,
} from '@heroui/react'
import { useMemo, useState } from 'react'
import CreatePermissionModal from '../../../../../shared/components/role-and-permission/CreatePermissionModal'

export const Route = createFileRoute(
    '/_administrator/admin/mgmt/role-n-permission/permissions'
)({
    component: AllPermissionsPage,
})

const MOCK_PERMISSIONS = [
    {
        id: '1',
        action: 'create',
        entity: 'post',
        description: 'Allow creating new posts',
    },
    {
        id: '2',
        action: 'delete',
        entity: 'post',
        description: 'Allow deleting any post',
    },
    {
        id: '3',
        action: 'moderate',
        entity: 'comment',
        description: 'Review and hide comments',
    },
]

export default function AllPermissionsPage() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [filterValue, setFilterValue] = useState('')

    const filteredItems = useMemo(() => {
        return MOCK_PERMISSIONS.filter((p) =>
            `${p.entity}:${p.action}`
                .toLowerCase()
                .includes(filterValue.toLowerCase())
        )
    }, [filterValue])

    const handleCreatePermission = () => {
        // console.log('New Permission Data:', data)
        // Logic gọi API thêm quyền ở đây
        onClose()
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        System Permissions
                    </h1>
                    <p className="text-small text-default-500">
                        Manage granular access controls
                    </p>
                </div>
                <Button
                    onPress={onOpen} // Kích hoạt Modal
                    color="primary"
                    startContent={<PlusIcon size={18} />}
                    className="font-bold shadow-lg shadow-primary/20"
                >
                    New Permission
                </Button>
            </div>

            {/* Search Toolbar */}
            <Input
                isClearable
                className="w-full sm:max-w-[350px]"
                placeholder="Search key (e.g. post:create)..."
                startContent={
                    <SearchIcon size={18} className="text-default-300" />
                }
                value={filterValue}
                onValueChange={setFilterValue}
                variant="bordered"
            />

            {/* Table */}
            <Table
                aria-label="Permissions table"
                classNames={{
                    wrapper: 'border border-divider shadow-none rounded-2xl',
                    th: 'bg-default-50 text-default-600 font-bold uppercase text-[10px]',
                }}
            >
                <TableHeader>
                    <TableColumn>PERMISSION KEY</TableColumn>
                    <TableColumn>ENTITY</TableColumn>
                    <TableColumn>ACTION</TableColumn>
                    <TableColumn>DESCRIPTION</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent={'No permissions found'}>
                    {filteredItems.map((p) => (
                        <TableRow
                            key={p.id}
                            className="border-b border-divider last:border-none"
                        >
                            <TableCell>
                                <code className="text-primary font-mono font-bold px-2 py-1 bg-primary-50 rounded text-xs">
                                    {p.entity}:{p.action}
                                </code>
                            </TableCell>
                            <TableCell>
                                <span className="capitalize text-sm font-medium">
                                    {p.entity}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    size="sm"
                                    variant="flat"
                                    color="secondary"
                                    className="capitalize font-bold text-[10px]"
                                >
                                    {p.action}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <span className="text-xs text-default-500">
                                    {p.description}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Tooltip color="danger" content="Delete">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        color="danger"
                                    >
                                        <TrashIcon size={16} />
                                    </Button>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Modal đã tồn tại */}
            <CreatePermissionModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={handleCreatePermission}
            />
        </div>
    )
}
