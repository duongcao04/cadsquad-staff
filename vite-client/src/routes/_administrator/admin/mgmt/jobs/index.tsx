import { INTERNAL_URLS } from '@/lib'
import { jobsListOptions } from '@/lib/queries'
import {
    AdminPageHeading,
    HeroBreadcrumbItem,
    HeroBreadcrumbs,
} from '@/shared/components'
import AdminContentContainer from '@/shared/components/admin/AdminContentContainer'
import AdminManagementJobsTable from '@/shared/components/management-jobs/AdminManagementJobsTable'
import { TJob } from '@/shared/types'
import {
    Badge,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Selection,
    useDisclosure,
} from '@heroui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { House } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'

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

    // Search State (Debounce Buffer)
    const [searchValue, setSearchValue] = useState(searchParams.search || '')

    const pagination = {
        limit: data.paginate?.limit ?? 10,
        page: data.paginate?.page ?? 1,
        totalPages: data.paginate?.totalPages ?? 1,
        total: data.paginate?.total ?? 0,
    }

    // Sync local search input with URL if URL changes externally
    useEffect(() => {
        setSearchValue(searchParams.search || '')
    }, [searchParams.search])

    // Modal State
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [bulkActionType, setBulkActionType] = useState<
        'DELETE' | 'STATUS' | null
    >(null)

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

    const handleSortChange = (newSort: string) => {
        navigate({
            search: (old) => ({
                ...old,
                sort: newSort, // undefined để về default
                page: 1, // Sort lại thì reset về trang 1
            }),
            replace: true,
        })
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

    return (
        <>
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
                        to={INTERNAL_URLS.admin}
                        className="text-text-subdued!"
                    >
                        Admin
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>Jobs</HeroBreadcrumbItem>
            </HeroBreadcrumbs>

            <AdminContentContainer className="mt-1">
                <AdminManagementJobsTable
                    onClearSearch={handleClearSearch}
                    onBulkAction={onBulkAction}
                    onSearchChange={handleSearchChange}
                    pagination={pagination}
                    data={data.jobs}
                    isLoadingData={isFetching}
                    onStatusFilterChange={setStatusFilter}
                    selectedKeys={selectedKeys}
                    searchValue={searchValue}
                    statusFilter={statusFilter}
                    onPageChange={handlePageChange}
                    onSelectionChange={setSelectedKeys}
                    sort={searchParams.sort ?? DEFAULT_SORT}
                    onSortChange={handleSortChange}
                />

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
        </>
    )
}
