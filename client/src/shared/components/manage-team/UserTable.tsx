'use client'

import { VietnamDateFormat } from '@/lib/dayjs' // Assumed path based on context
import { CopyButton, handleCopy, UserActiveChip } from '@/shared/components' // Assumed path
import { DepartmentChip } from '@/shared/components/chips' // Assumed path
import {
    addToast,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Input,
    Pagination,
    Select,
    Selection,
    SelectItem,
    SharedSelection,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
} from '@heroui/react'
import { Image } from 'antd'
import lodash from 'lodash'
import {
    Columns3Cog,
    EllipsisVertical,
    Filter,
    RotateCcw,
    SearchIcon,
    Sheet,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area'
import { TUser, UserColumnKey } from '../../types'
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
}

const ROW_PER_PAGE_OPTIONS = [
    { displayName: '10 items', value: 10 },
    { displayName: '20 items', value: 20 },
    { displayName: '50 items', value: 50 },
]

// Define columns for HeroUI
const USER_COLUMNS = [
    { uid: 'displayName', displayName: 'Display Name', sortable: true },
    { uid: 'email', displayName: 'Email', sortable: true },
    { uid: 'phoneNumber', displayName: 'Phone Number', sortable: true },
    { uid: 'department', displayName: 'Department', sortable: true },
    { uid: 'jobTitle', displayName: 'Job Title', sortable: true },
    { uid: 'isActive', displayName: 'Status', sortable: true },
    { uid: 'lastLoginAt', displayName: 'Last Login', sortable: true },
    { uid: 'createdAt', displayName: 'Created At', sortable: true },
    { uid: 'updatedAt', displayName: 'Updated At', sortable: true },
    { uid: 'action', displayName: 'Action', sortable: false },
]

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
}: Props) {
    const t = useTranslations()

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
                        <div className="flex items-center justify-start gap-2.5 min-w-[280px]">
                            <div className="overflow-hidden rounded-full size-10 flex-shrink-0">
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
                                <button
                                    className="flex items-center justify-start link w-fit hover:opacity-80 transition-opacity"
                                    title={t('copy')}
                                    onClick={() =>
                                        handleCopy(user.username, () => {
                                            addToast({
                                                title: t('copiedToClipboard'),
                                                color: 'success',
                                            })
                                        })
                                    }
                                >
                                    <p className="line-clamp-1 text-text-muted text-xs">
                                        @{user.username}
                                    </p>
                                </button>
                            </div>
                        </div>
                    )

                case 'email':
                    return (
                        <button
                            className="flex items-center justify-start link w-fit max-w-full hover:text-primary transition-colors"
                            title={t('copyEmail')}
                            onClick={() =>
                                handleCopy(user.email, () => {
                                    addToast({
                                        title: t('copiedToClipboard'),
                                        color: 'success',
                                    })
                                })
                            }
                        >
                            <p className="line-clamp-1 text-sm">{user.email}</p>
                        </button>
                    )

                case 'phoneNumber':
                    return (
                        <>
                            {user.phoneNumber ? (
                                <button
                                    className="flex items-center justify-start link w-fit hover:text-primary transition-colors"
                                    title="Copy phone number"
                                    onClick={() => {
                                        navigator.clipboard
                                            .writeText(user.phoneNumber!)
                                            .then(() =>
                                                addToast({
                                                    title: 'Copied phone number',
                                                    color: 'success',
                                                })
                                            )
                                            .catch(() =>
                                                addToast({
                                                    title: 'Failed to copy',
                                                    color: 'danger',
                                                })
                                            )
                                    }}
                                >
                                    <p className="line-clamp-1 text-sm">
                                        {user.phoneNumber}
                                    </p>
                                </button>
                            ) : (
                                <p className="text-text-muted">-</p>
                            )}
                        </>
                    )

                case 'department':
                    return (
                        <div className="w-full">
                            {user.department ? (
                                <DepartmentChip data={user.department} />
                            ) : (
                                <p className="link !text-text-muted text-sm cursor-pointer hover:underline">
                                    Add department
                                </p>
                            )}
                        </div>
                    )

                case 'jobTitle':
                    return (
                        <div>
                            {user.jobTitle ? (
                                <p className="line-clamp-1 text-sm">
                                    {user.jobTitle?.displayName}
                                </p>
                            ) : (
                                <p className="link !text-text-muted text-sm cursor-pointer hover:underline">
                                    Add job title
                                </p>
                            )}
                        </div>
                    )

                case 'isActive':
                    return (
                        <UserActiveChip
                            status={user.isActive ? 'activated' : 'unActivated'}
                        />
                    )

                case 'lastLoginAt':
                    return (
                        <p className="line-clamp-1 text-sm text-text-muted">
                            {user.lastLoginAt
                                ? VietnamDateFormat(user.lastLoginAt, {
                                      format: 'LT - L',
                                  })
                                : '-'}
                        </p>
                    )

                case 'createdAt':
                    return (
                        <div className="text-sm text-text-muted">
                            {user.createdAt &&
                                VietnamDateFormat(user.createdAt)}
                        </div>
                    )

                case 'updatedAt':
                    return (
                        <div className="text-sm text-text-muted">
                            {user.updatedAt &&
                                VietnamDateFormat(user.updatedAt)}
                        </div>
                    )

                case 'action':
                    return (
                        <div className="flex items-center justify-end gap-2">
                            <Tooltip content={t('copyEmail')}>
                                <Button
                                    variant="light"
                                    color="primary"
                                    className="flex items-center justify-center"
                                    size="sm"
                                    isIconOnly
                                    disableRipple
                                    onPress={() =>
                                        handleCopy(user.email, () =>
                                            addToast({
                                                title: t('copiedToClipboard'),
                                                color: 'success',
                                            })
                                        )
                                    }
                                >
                                    <CopyButton
                                        slot="p"
                                        content={user.email}
                                        variant="ghost"
                                    />
                                </Button>
                            </Tooltip>
                            <UserTableQuickActions data={user} />
                        </div>
                    )

                default:
                    return <p className="text-sm">{String(cellValue ?? '')}</p>
            }
        },
        [t]
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

                            <Button
                                startContent={
                                    <Filter className="text-small" size={14} />
                                }
                                variant="bordered"
                                size="sm"
                                className="hover:shadow-SM border-border-default border-1"
                                onPress={openFilterDrawer}
                            >
                                <span className="font-medium">Filter</span>
                            </Button>

                            {/* View Settings Dropdown */}
                            <Dropdown placement="bottom-end" showArrow>
                                <DropdownTrigger>
                                    <Button
                                        variant="bordered"
                                        size="sm"
                                        className="hover:shadow-SM border-border-default border-1"
                                        isIconOnly
                                    >
                                        <EllipsisVertical
                                            className="text-small"
                                            size={14}
                                        />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="View settings">
                                    <DropdownSection title={t('viewSettings')}>
                                        <DropdownItem
                                            key="columns"
                                            startContent={
                                                <Columns3Cog
                                                    size={16}
                                                    className="text-text-8"
                                                />
                                            }
                                            onPress={openViewColDrawer}
                                        >
                                            {t('viewColumns')}
                                        </DropdownItem>
                                    </DropdownSection>
                                </DropdownMenu>
                            </Dropdown>
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
                        <Button
                            startContent={
                                <Sheet className="text-small" size={14} />
                            }
                            variant="flat"
                            size="sm"
                            className="shadow-SM"
                        >
                            <span className="font-medium">
                                Download as .csv
                            </span>
                        </Button>
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
                    {ROW_PER_PAGE_OPTIONS.map((opt) => (
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
        <Table
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
                items={data}
                loadingContent={<Spinner />}
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
        </Table>
    )
}
