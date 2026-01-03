import { PageHeading } from '@/shared/components'
import { Button, Spinner, useDisclosure } from '@heroui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import lodash from 'lodash'
import { Suspense, useMemo, useState, useTransition } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { z } from 'zod'
import { getPageTitle } from '../../lib'
import { workbenchDataOptions } from '../../lib/queries'
import JobDetailDrawer from '../../shared/components/job-detail/JobDetailDrawer'
import AssignMemberModal from '../../shared/components/project-center/AssignMemberModal'
import WorkbenchMobileContent from '../../shared/components/workbench/WorkbenchMobileContent'
import WorkbenchTable from '../../shared/components/workbench/WorkbenchTable'
import { useDevice } from '../../shared/hooks'

const DEFAULT_SORT = 'displayName:asc'

export const workbenchParamsSchema = z.object({
    sort: z.string().optional().catch(DEFAULT_SORT),
    search: z.string().trim().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().catch(10),
    page: z.coerce.number().int().min(1).optional().catch(1),
})

export type TWorkbenchSearch = z.infer<typeof workbenchParamsSchema>

export const Route = createFileRoute('/_workspace/_workbench')({
    head: () => ({
        meta: [
            { title: getPageTitle('Workbench Dashboard') },
            {
                name: 'description',
                content:
                    'A high-level overview of your active tasks and upcoming deadlines.',
            },
        ],
    }),
    validateSearch: (search) => workbenchParamsSchema.parse(search),
    loaderDeps: ({ search }) => ({ search }),
    loader: ({ context, deps }) => {
        const {
            limit = 10,
            page = 1,
            search,
            sort = DEFAULT_SORT,
        } = deps.search
        void context.queryClient.ensureQueryData(
            workbenchDataOptions({
                limit,
                page,
                search,
                sort: [sort],
            })
        )
    },
    component: WorkbenchPage,
})

export function WorkbenchPage() {
    const { isSmallView } = useDevice()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()

    // useTransition is key to preventing the "jump" to Suspense fallback
    const [isPending, startTransition] = useTransition()

    // Generic function to handle all navigation updates with transition
    const updateSearch = (
        updater: (old: TWorkbenchSearch) => TWorkbenchSearch
    ) => {
        startTransition(() => {
            navigate({
                search: ((old: TWorkbenchSearch) =>
                    updater(old as TWorkbenchSearch)) as unknown as true,
                replace: true,
            })
        })
    }

    const handlePageChange = (newPage: number) =>
        updateSearch((old) => ({ ...old, page: newPage }))

    const handleSortChange = (newSort: string | null) =>
        updateSearch((old) => ({ ...old, sort: newSort || undefined, page: 1 }))

    const handleLimitChange = (newLimit: number) =>
        updateSearch((old) => ({ ...old, limit: newLimit, page: 1 }))

    const handleSearchChange = (newSearch?: string) =>
        updateSearch((old) => ({ ...old, search: newSearch, page: 1 }))

    return (
        <WorkbenchLayout>
            <ErrorBoundary
                fallback={
                    <div className="p-10 text-center text-danger">
                        <p className="font-bold text-lg">Failed to load data</p>
                        <Button onPress={() => window.location.reload()}>
                            Retry
                        </Button>
                    </div>
                }
            >
                {/* Wrapping in a custom div allows us to show a subtle loading state 
                  while useTransition is pending, instead of unmounting the whole table
                */}
                <div
                    className={`${
                        isPending
                            ? 'opacity-70 transition-opacity'
                            : 'opacity-100'
                    } size-full`}
                >
                    <Suspense fallback={<TableLoadingFallback />}>
                        {isSmallView ? (
                            <WorkbenchMobileContent
                                onAssignMember={() => {}}
                                currentPage={searchParams.page ?? 1}
                                onPageChange={handlePageChange}
                                search={searchParams.search}
                                onSearchChange={handleSearchChange}
                            />
                        ) : (
                            <WorkbenchTableContent
                                {...searchParams}
                                sort={searchParams.sort || DEFAULT_SORT}
                                limit={searchParams.limit || 10}
                                page={searchParams.page || 1}
                                onSortChange={handleSortChange}
                                onPageChange={handlePageChange}
                                onLimitChange={handleLimitChange}
                                onSearchChange={handleSearchChange}
                            />
                        )}
                    </Suspense>
                </div>
            </ErrorBoundary>
        </WorkbenchLayout>
    )
}

function WorkbenchLayout({ children }: { children: React.ReactNode }) {
    const { isDesktop } = useDevice()
    return (
        <>
            <PageHeading
                title="Workbench"
                classNames={{
                    wrapper: `${isDesktop ? '!py-3' : '!py-2'} pl-6 pr-3.5 border-b border-border-default`,
                }}
            />
            <div className="size-full pl-5 pr-3.5 pt-5">{children}</div>
        </>
    )
}

function TableLoadingFallback() {
    return (
        <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-divider bg-background">
            <Spinner size="lg" color="primary" label="Loading workbench..." />
        </div>
    )
}

export type WorkbenchTableContentProps = {
    limit: number
    page: number
    sort: string
    search?: string
    onSearchChange: (newSearch?: string) => void
    onPageChange: (newPage: number) => void
    onSortChange: (newSort: string) => void
    onLimitChange: (newLimit: number) => void
}

function WorkbenchTableContent({
    limit,
    page,
    sort,
    search,
    onSearchChange,
    onSortChange,
    onPageChange,
    onLimitChange,
}: WorkbenchTableContentProps) {
    const [viewDetailNo, setViewDetailNo] = useState<string | null>(null)
    const [assignMemberTo, setAssignMemberTo] = useState<string | null>(null)

    const options = workbenchDataOptions({
        limit,
        page,
        search,
        sort: [sort],
    })

    const {
        data: { jobs, paginate },
        refetch,
        isFetching,
    } = useSuspenseQuery(options)

    const {
        isOpen: isOpenJobDetailDrawer,
        onOpen: onOpenJobDetailDrawer,
        onClose: onCloseJobDetailDrawer,
    } = useDisclosure({ id: 'JobDetailDrawer' })

    const {
        isOpen: isOpenAssignMemberModal,
        onOpen: onOpenAssignMemberModal,
        onClose: onCloseAssignMemberModal,
    } = useDisclosure({ id: 'AssignMemberModal' })

    const onViewDetail = (jobNo: string) => {
        setViewDetailNo(jobNo)
        onOpenJobDetailDrawer()
    }

    const onAssignMember = (jobNo: string) => {
        setAssignMemberTo(jobNo)
        onOpenAssignMemberModal()
    }

    // Debounce the search input to avoid triggering a network request for every keystroke
    const debouncedSearchChange = useMemo(
        () => lodash.debounce((value: string) => onSearchChange(value), 500),
        [onSearchChange]
    )

    return (
        <>
            <WorkbenchTable
                onViewDetail={onViewDetail}
                onAssignMember={onAssignMember}
                onRefresh={refetch}
                pagination={{
                    limit,
                    page,
                    total: paginate?.total ?? 0,
                    totalPages: paginate?.totalPages ?? 1,
                }}
                onLimitChange={onLimitChange}
                onPageChange={onPageChange}
                // Use debounced function for typing, but keep standard for instant clears if needed
                onSearchChange={(val) => {
                    if (!val)
                        onSearchChange(undefined) // Instant reset on clear
                    else debouncedSearchChange(val)
                }}
                onSortChange={onSortChange}
                sort={sort}
                data={jobs}
                isLoadingData={isFetching}
            />

            {isOpenJobDetailDrawer && viewDetailNo && (
                <JobDetailDrawer
                    jobNo={viewDetailNo}
                    isOpen={isOpenJobDetailDrawer}
                    onClose={() => {
                        onCloseJobDetailDrawer()
                        setViewDetailNo(null)
                    }}
                />
            )}

            {isOpenAssignMemberModal && assignMemberTo && (
                <AssignMemberModal
                    jobNo={assignMemberTo}
                    isOpen={isOpenAssignMemberModal}
                    onClose={() => {
                        onCloseAssignMemberModal()
                        setAssignMemberTo(null)
                    }}
                />
            )}
        </>
    )
}
