import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Selection,
    SortDescriptor,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ChipProps,
    Badge,
} from '@heroui/react'
import {
    Search,
    MoreVertical,
    ChevronDown,
    Trash2,
    CheckCircle2,
    Calendar,
    Edit,
    Eye,
    House,
} from 'lucide-react'
import { INTERNAL_URLS } from '@/lib'
import { jobsListOptions } from '@/lib/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
    AdminPageHeading,
    HeroBreadcrumbItem,
    HeroBreadcrumbs,
    HeroTable,
    JobStatusChip,
} from '../../../../../shared/components'
import { TJob } from '../../../../../shared/types'
import AdminContentContainer from '../../../../../shared/components/admin/AdminContentContainer'

// --- Mock / Missing Definitions (Move these to your types/constants files) ---
type JobStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED'
type JobPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface Job {
    id: string
    no: string
    title: string // mapped from displayName
    displayName: string
    type: string
    client: string // mapped from clientName
    clientName: string
    status: JobStatus
    priority: JobPriority
    dueAt: string
    income: number
    assignees: Array<{ name: string; avatar: string }>
}

const statusColorMap: Record<string, ChipProps['color']> = {
    TODO: 'default',
    IN_PROGRESS: 'primary',
    REVIEW: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'danger',
}

const priorityColorMap: Record<string, ChipProps['color']> = {
    LOW: 'default',
    MEDIUM: 'primary',
    HIGH: 'warning',
    URGENT: 'danger',
}

const STATUS_OPTIONS = [
    { name: 'To Do', uid: 'TODO' },
    { name: 'In Progress', uid: 'IN_PROGRESS' },
    { name: 'Review', uid: 'REVIEW' },
    { name: 'Completed', uid: 'COMPLETED' },
]

const PRIORITY_OPTIONS = [
    { name: 'Low', uid: 'LOW' },
    { name: 'Medium', uid: 'MEDIUM' },
    { name: 'High', uid: 'HIGH' },
    { name: 'Urgent', uid: 'URGENT' },
]
// --------------------------------------------------------------------------

const DEFAULT_SORT = 'displayName:asc'

export const manageJobsParamsSchema = z.object({
    sort: z.string().optional().catch(DEFAULT_SORT),
    search: z.string().trim().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().catch(10),
    page: z.coerce.number().int().min(1).optional().catch(1),
})

export type TManageJobsParams = z.infer<typeof manageJobsParamsSchema>

export const Route = createFileRoute('/_administrator/admin/mgmt/jobs/')({
    validateSearch: (search) => manageJobsParamsSchema.parse(search),
    loaderDeps: ({ search }) => ({ search }),
    loader: ({ context, deps }) => {
        const {
            limit = 10,
            page = 1,
            search,
            sort = DEFAULT_SORT,
        } = deps.search

        return context.queryClient.ensureQueryData(
            jobsListOptions({
                limit,
                page,
                search,
                sort: [sort],
                tab: 'active',
                hideFinishItems: '0',
            })
        )
    },
    component: ManageJobsPage,
})

const columns = [
    { name: 'JOB INFO', uid: 'info', sortable: true },
    { name: 'CLIENT', uid: 'client', sortable: true },
    { name: 'ASSIGNEES', uid: 'assignees' },
    { name: 'STATUS', uid: 'status', sortable: true },
    { name: 'PRIORITY', uid: 'priority', sortable: true },
    { name: 'DUE DATE', uid: 'dueAt', sortable: true },
    { name: 'INCOME', uid: 'income', sortable: true },
    { name: 'ACTIONS', uid: 'actions' },
]

function ManageJobsPage() {
    const navigate = useNavigate({ from: Route.fullPath })
    const searchParams = Route.useSearch()

    // Server state
    const options = jobsListOptions({
        ...searchParams,
        tab: 'active',
        hideFinishItems: '0',
        sort: [searchParams.sort || DEFAULT_SORT], // Ensure sort is an array if your API expects it
    })
    const { data, isFetching } = useSuspenseQuery(options)

    // Local UI state
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
    const [statusFilter, setStatusFilter] = useState<Selection>('all')
    const [priorityFilter, setPriorityFilter] = useState<Selection>('all')

    // Search State (Debounce Buffer)
    const [searchValue, setSearchValue] = useState(searchParams.search || '')

    // Sync local search input with URL if URL changes externally
    useEffect(() => {
        setSearchValue(searchParams.search || '')
    }, [searchParams.search])

    // Modal State
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [bulkActionType, setBulkActionType] = useState<
        'DELETE' | 'STATUS' | null
    >(null)

    // --- Helpers for Sort Descriptor <-> URL Param ---
    const sortDescriptor = useMemo<SortDescriptor>(() => {
        const [column, direction] = (searchParams.sort || DEFAULT_SORT).split(
            ':'
        )
        return {
            column: column === 'displayName' ? 'info' : column, // map UI column keys to API keys
            direction: direction === 'desc' ? 'descending' : 'ascending',
        }
    }, [searchParams.sort])

    // --- Handlers ---

    // 1. Search Debounce
    const handleSearchChange = (value: string) => {
        setSearchValue(value)
        const timeoutId = setTimeout(() => {
            navigate({
                search: (prev) => ({
                    ...prev,
                    search: value || undefined,
                    page: 1,
                }),
            })
        }, 500) // 500ms debounce
        return () => clearTimeout(timeoutId)
    }

    const handleClearSearch = () => {
        setSearchValue('')
        navigate({
            search: (prev) => ({ ...prev, search: undefined, page: 1 }),
        })
    }

    // 2. Sorting
    const handleSortChange = (descriptor: SortDescriptor) => {
        const dir = descriptor.direction === 'descending' ? 'desc' : 'asc'
        let col = descriptor.column

        // Map UI columns back to API fields if necessary
        if (col === 'info') col = 'displayName'
        if (col === 'client') col = 'clientName'

        navigate({
            search: (prev) => ({ ...prev, sort: `${col}:${dir}` }),
        })
    }

    // 3. Pagination
    const handlePageChange = (newPage: number) => {
        navigate({
            search: (prev) => ({ ...prev, page: newPage }),
        })
    }

    // 4. Bulk Actions
    const onBulkAction = (type: 'DELETE' | 'STATUS') => {
        setBulkActionType(type)
        onOpen()
    }

    const handleBulkConfirm = () => {
        const selectedIds =
            selectedKeys === 'all'
                ? data.jobs.map((j: TJob) => j.id) // Assuming 'all' means all on current page
                : Array.from(selectedKeys)

        console.log(`Performing ${bulkActionType} on IDs:`, selectedIds)

        setSelectedKeys(new Set([]))
        onOpenChange()
    }

    // --- Render Cell ---
    const renderCell = useCallback((job: TJob, columnKey: React.Key) => {
        switch (columnKey) {
            case 'info':
                return (
                    <div>
                        <p className="font-bold text-slate-800">
                            {job.displayName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-mono bg-slate-100 text-slate-500 px-1 py-0.5 rounded">
                                {job.no}
                            </span>
                            <span className="text-xs text-slate-400">
                                {job.type.displayName}
                            </span>
                        </div>
                    </div>
                )
            case 'client':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {job.clientName}
                        </p>
                    </div>
                )
            case 'assignees':
                return (
                    <div className="flex -space-x-2">
                        {job.assignee?.length > 0 ? (
                            job.assignee.map((a, i) => (
                                <User
                                    key={i}
                                    name={a.displayName}
                                    avatarProps={{ src: a.avatar, size: 'sm' }}
                                    classNames={{ name: 'hidden' }}
                                />
                            ))
                        ) : (
                            <span className="text-xs text-slate-400 italic">
                                Unassigned
                            </span>
                        )}
                    </div>
                )
            case 'status':
                return <JobStatusChip data={job.status} />
            case 'priority':
                return (
                    <Chip
                        className="capitalize border-none"
                        color={priorityColorMap[job.priority] || 'default'}
                        size="sm"
                        variant="dot"
                    >
                        {job.priority}
                    </Chip>
                )
            case 'dueAt':
                return (
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <Calendar size={14} />
                        {new Date(job.dueAt).toLocaleDateString()}
                    </div>
                )
            case 'income':
                return (
                    <span className="font-bold text-slate-700">
                        ${job.incomeCost.toLocaleString()}
                    </span>
                )
            case 'actions':
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <MoreVertical className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem startContent={<Eye size={16} />}>
                                    View Details
                                </DropdownItem>
                                <DropdownItem startContent={<Edit size={16} />}>
                                    <Link to={INTERNAL_URLS.editJob(job.id)}>
                                        Edit Job
                                    </Link>
                                </DropdownItem>
                                <DropdownItem
                                    startContent={<CheckCircle2 size={16} />}
                                    className="text-success"
                                    color="success"
                                >
                                    Mark Done
                                </DropdownItem>
                                <DropdownItem
                                    startContent={<Trash2 size={16} />}
                                    className="text-danger"
                                    color="danger"
                                >
                                    Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                )
            default:
                // @ts-ignore
                return job[columnKey]
        }
    }, [])

    // --- Top Content ---
    const topContent = useMemo(() => {
        const selectedCount =
            selectedKeys === 'all' ? data.jobs.length : selectedKeys.size

        return (
            <div className="flex flex-col gap-4">
                {/* Filters & Search */}
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by job name, ID, or client..."
                        startContent={<Search className="text-default-300" />}
                        value={searchValue}
                        onClear={handleClearSearch}
                        onValueChange={handleSearchChange}
                        size="sm"
                        variant="bordered"
                    />
                    <div className="flex gap-3">
                        {/* Status Dropdown */}
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={
                                        <ChevronDown className="text-small" />
                                    }
                                    variant="flat"
                                    size="sm"
                                >
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Status Filter"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <DropdownItem
                                        key={status.uid}
                                        className="capitalize"
                                    >
                                        {status.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        {/* Priority Dropdown */}
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={
                                        <ChevronDown className="text-small" />
                                    }
                                    variant="flat"
                                    size="sm"
                                >
                                    Priority
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Priority Filter"
                                closeOnSelect={false}
                                selectedKeys={priorityFilter}
                                selectionMode="multiple"
                                onSelectionChange={setPriorityFilter}
                            >
                                {PRIORITY_OPTIONS.map((p) => (
                                    <DropdownItem
                                        key={p.uid}
                                        className="capitalize"
                                    >
                                        {p.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>

                {/* Bulk Action Bar */}
                {selectedCount > 0 && (
                    <div className="bg-primary-50 px-4 py-2 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                        <span className="text-sm text-primary-700 font-semibold">
                            {selectedCount} jobs selected
                        </span>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                color="primary"
                                variant="flat"
                                onPress={() => onBulkAction('STATUS')}
                            >
                                Update Status
                            </Button>
                            <Button
                                size="sm"
                                color="danger"
                                variant="flat"
                                startContent={<Trash2 size={16} />}
                                onPress={() => onBulkAction('DELETE')}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        )
    }, [
        searchValue,
        statusFilter,
        priorityFilter,
        selectedKeys,
        data.jobs.length,
    ])

    // --- Bottom Content ---
    const bottomContent = useMemo(() => {
        // Assuming API returns meta: { total: number }
        const totalPages = Math.ceil(
            (data.meta?.total || data.jobs.length) / (searchParams.limit || 10)
        )

        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === 'all'
                        ? 'All items selected'
                        : `${selectedKeys.size} of ${data.jobs.length} selected`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={searchParams.page || 1}
                    total={totalPages}
                    onChange={handlePageChange}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button
                        isDisabled={(searchParams.page || 1) === 1}
                        size="sm"
                        variant="flat"
                        onPress={() =>
                            handlePageChange((searchParams.page || 1) - 1)
                        }
                    >
                        Previous
                    </Button>
                    <Button
                        isDisabled={(searchParams.page || 1) === totalPages}
                        size="sm"
                        variant="flat"
                        onPress={() =>
                            handlePageChange((searchParams.page || 1) + 1)
                        }
                    >
                        Next
                    </Button>
                </div>
            </div>
        )
    }, [
        selectedKeys,
        data.jobs.length,
        data.paginate?.total,
        searchParams.page,
        searchParams.limit,
    ])

    return (
        <div>
            <AdminPageHeading
                title={
                    <Badge
                        content={data.paginate?.total}
                        size="sm"
                        color="danger"
                        variant="solid"
                        classNames={{
                            badge: '-right-1 top-1 text-[10px]! font-bold!',
                        }}
                    >
                        All Jobs
                    </Badge>
                }
            />

            <HeroBreadcrumbs className="pt-3 px-7 text-xs">
                <HeroBreadcrumbItem>
                    <Link
                        to={INTERNAL_URLS.home}
                        className="text-text-subdued!"
                    >
                        <House size={16} />
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>
                    <Link
                        to={INTERNAL_URLS.admin}
                        className="text-text-subdued!"
                    >
                        Admin
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>All Jobs</HeroBreadcrumbItem>
            </HeroBreadcrumbs>

            <AdminContentContainer className="mt-1">
                <HeroTable
                    aria-label="Jobs Table"
                    isHeaderSticky
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
                    classNames={{
                        wrapper: 'max-h-[700px]',
                    }}
                    selectedKeys={selectedKeys}
                    selectionMode="multiple"
                    sortDescriptor={sortDescriptor}
                    topContent={topContent}
                    topContentPlacement="outside"
                    onSelectionChange={setSelectedKeys}
                    onSortChange={handleSortChange}
                >
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn
                                key={column.uid}
                                align={
                                    column.uid === 'actions'
                                        ? 'center'
                                        : 'start'
                                }
                                allowsSorting={column.sortable}
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody
                        emptyContent={'No jobs found'}
                        items={data.jobs} // Use Server Data
                        isLoading={isFetching} // Show loading state
                    >
                        {(item: Job) => (
                            <TableRow key={item.id}>
                                {(columnKey) => (
                                    <TableCell>
                                        {renderCell(item, columnKey)}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </HeroTable>

                {/* Modal */}
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Confirm{' '}
                                    {bulkActionType === 'DELETE'
                                        ? 'Deletion'
                                        : 'Update'}
                                </ModalHeader>
                                <ModalBody>
                                    <p className="text-slate-600">
                                        Are you sure you want to{' '}
                                        {bulkActionType === 'DELETE'
                                            ? 'permanently delete'
                                            : 'update'}{' '}
                                        the{' '}
                                        <strong>
                                            {selectedKeys === 'all'
                                                ? data.jobs.length
                                                : selectedKeys.size}
                                        </strong>{' '}
                                        selected jobs?
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="default"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color={
                                            bulkActionType === 'DELETE'
                                                ? 'danger'
                                                : 'primary'
                                        }
                                        onPress={handleBulkConfirm}
                                    >
                                        Confirm
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </AdminContentContainer>
        </div>
    )
}
