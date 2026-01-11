import {
    useReactTable,
    getCoreRowModel,
    SortingState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { Input, Pagination, Select, SelectItem } from '@heroui/react'
import { SearchIcon, UserPlus, FileDown } from 'lucide-react'
import { TanStackHeroTable } from '@/shared/components/ui/tanstack-hero-table'

type Props = {
    data: TUser[]
    isLoading: boolean
    pagination: {
        page: number
        limit: number
        totalPages: number
        total: number
    }
    sortString?: string
    onSortChange: (sortStr: string) => void
    onPageChange: (page: number) => void
    onSearch: (term: string) => void
    onAddStaff: (user: TUser) => void
}

export default function StaffDirectoryTable({
    data,
    isLoading,
    pagination,
    sortString,
    onSortChange,
    onPageChange,
    onSearch,
    onAddStaff,
}: Props) {
    // 1. Sync Sorting State
    const sorting = useMemo<SortingState>(() => {
        if (!sortString) return []
        const [id, dir] = sortString.split(':')
        return [{ id, desc: dir === 'desc' }]
    }, [sortString])

    // 2. Initialize Table
    const table = useReactTable({
        data,
        columns: staffColumns,
        state: { sorting },
        manualSorting: true,
        onSortingChange: (updater) => {
            if (typeof updater === 'function') {
                const newSort = updater(sorting)
                if (newSort[0]) {
                    onSortChange(
                        `${newSort[0].id}:${newSort[0].desc ? 'desc' : 'asc'}`
                    )
                }
            }
        },
        getCoreRowModel: getCoreRowModel(),
    })

    // 3. Top Controls (Search, Filter, Add)
    const topContent = (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end gap-3">
                <Input
                    isClearable
                    classNames={{
                        base: 'w-full sm:max-w-[44%]',
                        inputWrapper: 'border-1',
                    }}
                    placeholder="Search by name, email, or role..."
                    size="sm"
                    startContent={
                        <SearchIcon className="text-default-300" size={16} />
                    }
                    variant="bordered"
                    onValueChange={onSearch}
                />
                <div className="flex gap-3">
                    <Button
                        variant="flat"
                        color="default"
                        startContent={<FileDown size={16} />}
                        className="hidden sm:flex"
                    >
                        Export
                    </Button>
                    <Button
                        color="primary"
                        startContent={<UserPlus size={18} />}
                        // onPress={() => onAddStaff(data)}
                        className="font-bold shadow-md shadow-primary/20"
                    >
                        Add New Member
                    </Button>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-default-400 text-small">
                    Total {pagination.total} employees
                </span>
            </div>
        </div>
    )

    // 4. Bottom Controls (Pagination)
    const bottomContent = (
        <div className="flex w-full justify-center">
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={pagination.page}
                total={pagination.totalPages}
                onChange={onPageChange}
            />
        </div>
    )

    return (
        <div className="space-y-4">
            {topContent}

            <TanStackHeroTable
                table={table}
                isLoading={isLoading}
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: 'min-h-[500px]',
                }}
            />
        </div>
    )
}

import { createColumnHelper } from '@tanstack/react-table'
import { TUser } from '@/shared/types' // Replace with your actual User type
import {
    User,
    Chip,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from '@heroui/react'
import {
    EllipsisVertical,
    Mail,
    Phone,
    ShieldCheck,
    Edit3,
    Trash2,
} from 'lucide-react'
import { optimizeCloudinary } from '../../../../../lib'

const columnHelper = createColumnHelper<TUser>()

export const staffColumns = [
    // 1. User Identity (Avatar + Name + Email)
    columnHelper.accessor('displayName', {
        header: 'Employee',
        cell: (info) => (
            <User
                name={info.getValue()}
                description={info.row.original.email}
                avatarProps={{
                    src: optimizeCloudinary(info.row.original.avatar),
                    radius: 'lg',
                    isBordered: true,
                    color: 'primary',
                }}
                classNames={{
                    name: 'font-bold text-default-700',
                    description: 'text-tiny text-default-400',
                }}
            />
        ),
    }),

    // 2. Role (Color-coded Badge)
    columnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => {
            const role = info.getValue()
            return (
                <Chip
                    size="sm"
                    variant="flat"
                    className="capitalize font-semibold gap-1"
                    style={{
                        backgroundColor: `${role?.hexColor}20`, // 20% opacity background
                        color: role?.hexColor,
                        borderColor: role?.hexColor,
                    }}
                    startContent={<ShieldCheck size={14} />}
                >
                    {role?.displayName || 'No Role'}
                </Chip>
            )
        },
    }),

    // 3. Department
    columnHelper.accessor('department', {
        header: 'Department',
        cell: (info) => (
            <div className="flex flex-col">
                <span className="text-small font-medium">
                    {info.getValue()?.displayName || '-'}
                </span>
                <span className="text-tiny text-default-400">
                    {info.getValue()?.displayName || 'Member'}
                </span>
            </div>
        ),
    }),

    // 4. Status (Active/Inactive)
    columnHelper.accessor('isActive', {
        header: 'Status',
        cell: (info) => (
            <Chip
                startContent={
                    <div
                        className={`size-2 rounded-full ${info.getValue() ? 'bg-success' : 'bg-default-400'}`}
                    />
                }
                variant="light"
                size="sm"
                classNames={{ base: 'pl-0' }}
            >
                {info.getValue() ? 'Active' : 'Inactive'}
            </Chip>
        ),
    }),

    // 5. Contact Info (Icons)
    columnHelper.display({
        id: 'contact',
        header: 'Contact',
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    as="a"
                    href={`mailto:${row.original.email}`}
                >
                    <Mail size={16} className="text-default-500" />
                </Button>
                {row.original.phoneNumber && (
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        as="a"
                        href={`tel:${row.original.phoneNumber}`}
                    >
                        <Phone size={16} className="text-default-500" />
                    </Button>
                )}
            </div>
        ),
    }),

    // 6. Actions (Dropdown)
    columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
            <div className="flex justify-end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Button isIconOnly variant="light" size="sm">
                            <EllipsisVertical
                                size={18}
                                className="text-default-400"
                            />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Staff Actions" variant="flat">
                        <DropdownItem
                            key="edit"
                            startContent={<Edit3 size={16} />}
                        >
                            Edit Profile
                        </DropdownItem>
                        <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<Trash2 size={16} />}
                        >
                            Deactivate User
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        ),
    }),
]
