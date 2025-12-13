import { dateFormatter } from '@/lib/dayjs'
import { phoneNumberFormatter } from '@/lib/phone-number'
import { TABLE_ROW_PER_PAGE_OPTIONS, USER_COLUMNS } from '@/lib/utils'
import { DepartmentChip, UserActiveChip } from '@/shared/components'
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area'
import type { TUser, UserColumnKey } from '@/shared/types'
import {
    Button,
    Input,
    Pagination,
    Select,
    SelectItem,
    Skeleton,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    type SharedSelection,
} from '@heroui/react'
import { Image } from 'antd'
import lodash from 'lodash'
import { RotateCcw, SearchIcon, UserRoundPlus } from 'lucide-react'
import React, { useState } from 'react'
import { HeroButton } from '../ui/hero-button'
import HeroCopyButton from '../ui/hero-copy-button'
import { HeroTable } from '../ui/hero-table'
import { HeroTooltip } from '../ui/hero-tooltip'
import { UserTableQuickActions } from './UserTableQuickActions'

interface UserTableOptions {
    fillContainerHeight?: boolean
}

interface Props {
    data: TUser[]
    isLoading?: boolean
    onRefresh?: () => void
    visibleColumns: 'all' | Set<UserColumnKey>
    options?: UserTableOptions
    openFilterDrawer: () => void
    openViewColDrawer: () => void
    // Add pagination props if managed by parent, otherwise use store
    page: number
    totalPages: number
    onPageChange: (page: number) => void
    rowPerPage: number
    onRowPerPageChange: (val: number) => void
    onOpenCreateUserModal: () => void
}

export default function UserTable({
    data,
    isLoading = false,
    onRefresh,
    visibleColumns,
    options = { fillContainerHeight: false },
    openFilterDrawer,
    openViewColDrawer,
    page,
    totalPages,
    onPageChange,
    rowPerPage,
    onRowPerPageChange,
    onOpenCreateUserModal,
}: Props) {
    // --- State (Replace with your Store logic if preferred) ---
    const [searchValue, setSearchValue] = useState('')
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

    // --- Handlers ---
    const onSearchClear = () => setSearchValue('')
    const onSearchChange = (value: string) => setSearchValue(value)

    const handleRowPerPageChange = (keys: SharedSelection) => {
        const value = Array.from(keys)[0]
        if (value) onRowPerPageChange(parseInt(value.toString()))
    }

    // --- Column Visibility ---
    const headerColumns = React.useMemo(() => {
        if (visibleColumns === 'all') return USER_COLUMNS
        return USER_COLUMNS.filter((column) =>
            visibleColumns.has(column.uid as UserColumnKey)
        )
    }, [visibleColumns])

    // --- Render Cell Logic (Mapped from your AntD userColumns) ---
    const renderCell = React.useCallback(
        (user: TUser, columnKey: React.Key) => {
            const cellValue = lodash.get(user, columnKey as string)

            switch (columnKey) {
                case 'displayName':
                    return (
                        <div className="group flex items-center justify-start size-full! gap-2  min-w-60">
                            <div className="flex items-center justify-start gap-2.5">
                                <div className="overflow-hidden rounded-full size-10 shrink-0">
                                    <Image
                                        src={String(user.avatar)}
                                        alt={user.displayName}
                                        className="object-cover rounded-full size-full"
                                        preview={false}
                                        fallback="/images/placeholder-avatar.png" // Add a fallback if needed
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <p className="line-clamp-1 font-semibold text-sm">
                                        {user.displayName}
                                    </p>
                                    <p className="line-clamp-1 text-text-subdued text-xs">
                                        @{user.username}
                                    </p>
                                </div>
                            </div>
                            <HeroTooltip content="Copy username">
                                <HeroCopyButton
                                    textValue={user.email}
                                    className="opacity-0 group-hover:opacity-80"
                                />
                            </HeroTooltip>
                        </div>
                    )

                case 'email':
                    return (
                        <div className="group flex items-center justify-start size-full! gap-2">
                            <p className="line-clamp-1 text-sm">{user.email}</p>
                            <HeroTooltip content="Copy email">
                                <HeroCopyButton
                                    textValue={user.email}
                                    className="opacity-0 group-hover:opacity-80"
                                />
                            </HeroTooltip>
                        </div>
                    )

                case 'phoneNumber':
                    return (
                        <div className="group flex items-center justify-start size-full! gap-2">
                            {user.phoneNumber && (
                                <>
                                    <p className="line-clamp-1 text-sm">
                                        {
                                            phoneNumberFormatter(
                                                user.phoneNumber
                                            ).formatted
                                        }
                                    </p>
                                    <HeroTooltip content="Copy phone">
                                        <HeroCopyButton
                                            textValue={
                                                phoneNumberFormatter(
                                                    user.phoneNumber
                                                ).formatted
                                            }
                                            className="opacity-0 group-hover:opacity-80"
                                        />
                                    </HeroTooltip>
                                </>
                            )}
                        </div>
                    )

                case 'department':
                    return (
                        <div className="w-full">
                            {user.department && (
                                <DepartmentChip data={user.department} />
                            )}
                        </div>
                    )

                case 'jobTitle':
                    return (
                        <p className="line-clamp-1 text-sm">
                            {user.jobTitle?.displayName ?? ''}
                        </p>
                    )

                case 'isActive':
                    return (
                        <UserActiveChip
                            status={user.isActive ? 'activated' : 'unActivated'}
                        />
                    )

                case 'lastLoginAt':
                    return (
                        <p className="text-sm font-medium text-text-7">
                            {user.lastLoginAt &&
                                dateFormatter(user.lastLoginAt, {
                                    format: 'semiDateTime',
                                })}
                        </p>
                    )

                case 'createdAt':
                    return (
                        <div className="text-sm font-medium text-text-7">
                            {user.createdAt &&
                                dateFormatter(user.createdAt, {
                                    format: 'semiLongDate',
                                })}
                        </div>
                    )

                case 'action':
                    return (
                        <div className="flex items-center justify-end gap-2">
                            <HeroTooltip content="Copy email">
                                <HeroCopyButton textValue={user.email} />
                            </HeroTooltip>
                            <UserTableQuickActions data={user} />
                        </div>
                    )

                default:
                    return <p className="text-sm">{String(cellValue ?? '')}</p>
            }
        },
        []
    )

    // --- Top Content (Filters, Actions) ---
    const topContent = React.useMemo(() => {
        return (
            <div className="w-full flex flex-col gap-4">
                <div className="w-full flex justify-between gap-3 items-end">
                    {/* Left Side: Search & Filters */}
                    <div className="flex items-center justify-start gap-2">
                        <Input
                            isClearable
                            classNames={{
                                base: 'w-[350px] lg:w-[450px]',
                                inputWrapper:
                                    'hover:shadow-SM bg-background border-border-default border-1',
                            }}
                            variant="bordered"
                            size="sm"
                            placeholder="Search by name, email..."
                            startContent={
                                <div className="w-4 flex items-center justify-center">
                                    <SearchIcon
                                        className="text-small text-text-6"
                                        size={14}
                                    />
                                </div>
                            }
                            value={searchValue}
                            onClear={onSearchClear}
                            onValueChange={onSearchChange}
                        />

                        <div className="w-px mx-3 h-5 bg-text-muted"></div>

                        <div className="flex gap-3">
                            <Button
                                startContent={
                                    <RotateCcw
                                        className="text-small"
                                        size={14}
                                    />
                                }
                                variant="bordered"
                                size="sm"
                                className="hover:shadow-SM border-border-default border-1"
                                onPress={onRefresh}
                            >
                                <span className="font-medium">Refresh</span>
                            </Button>
                        </div>

                        {/* Bulk Selection Indicator */}
                        <div className="w-px mx-3 h-5 bg-text-muted"></div>
                        {(selectedKeys === 'all' || selectedKeys.size > 0) && (
                            <div className="flex items-center justify-start gap-3">
                                <p className="text-sm">
                                    {selectedKeys === 'all'
                                        ? 'All items selected'
                                        : `${selectedKeys.size} selected`}
                                </p>
                                {/* Insert your BulkActions component here if you have one */}
                                {/* <UserTableBulkActions keys={selectedKeys} /> */}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Export */}
                    <div>
                        <HeroButton
                            startContent={
                                <UserRoundPlus
                                    className="text-small"
                                    size={14}
                                />
                            }
                            variant="flat"
                            size="sm"
                            className="shadow-SM"
                            color="blue"
                            onPress={onOpenCreateUserModal}
                        >
                            Create user
                        </HeroButton>
                    </div>
                </div>
            </div>
        )
    }, [
        searchValue,
        selectedKeys,
        t,
        onRefresh,
        openFilterDrawer,
        openViewColDrawer,
    ])

    // --- Bottom Content (Pagination) ---
    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Select
                    className="w-[120px]"
                    placeholder="Rows per page"
                    variant="bordered"
                    classNames={{ trigger: 'shadow-SM' }}
                    selectionMode="single"
                    selectedKeys={[rowPerPage.toString()]}
                    onSelectionChange={handleRowPerPageChange}
                >
                    {TABLE_ROW_PER_PAGE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value}>
                            {opt.displayName}
                        </SelectItem>
                    ))}
                </Select>

                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={totalPages}
                    onChange={onPageChange}
                />

                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button
                        isDisabled={page === 1}
                        size="sm"
                        variant="flat"
                        onPress={() => onPageChange(page - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        isDisabled={page === totalPages}
                        size="sm"
                        variant="flat"
                        onPress={() => onPageChange(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        )
    }, [page, totalPages, rowPerPage])

    // --- Main Render ---
    return (
        <HeroTable
            aria-label="User table"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            // Use custom ScrollArea wrapper for horizontal scroll + sticky header feel
            BaseComponent={(found) => (
                <ScrollArea className="size-full h-full! border-1 border-border p-2 rounded-md min-h-[calc(100%-150px)]">
                    <ScrollBar orientation="horizontal" />
                    <ScrollBar orientation="vertical" />
                    {found.children}
                </ScrollArea>
            )}
            classNames={{
                base: `${options.fillContainerHeight ? 'h-full' : ''}`,
                table: 'relative',
            }}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === 'action' ? 'center' : 'start'}
                        allowsSorting={column.sortable}
                    >
                        {column.displayName}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={'No users found'}
                items={isLoading ? [] : data}
                loadingContent={
                    <div className="flex flex-col gap-3 w-full mt-16">
                        {Array.from({
                            length: 5,
                        }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="rounded-md w-full h-8!"
                            />
                        ))}
                    </div>
                }
                isLoading={isLoading}
            >
                {(item) => (
                    <TableRow key={item.id ?? item.username}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </HeroTable>
    )
}
