import {
    excelApi,
    getPageTitle,
    JOB_COLUMNS,
    jobApi,
    STORAGE_KEYS,
} from '@/lib'
import {
    jobsListOptions,
    jobStatusesListOptions,
    jobTypesListOptions,
    paymentChannelsListOptions,
    useProfile,
    usersListOptions,
} from '@/lib/queries'
import {
    TJobFilters,
    TDownloadExcelInput,
    jobFiltersSchema,
} from '@/lib/validationSchemas'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { Spinner, Tab, Tabs, useDisclosure } from '@heroui/react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import {
    CircleCheckBig,
    ClockAlert,
    PinIcon,
    SquareX,
    Truck,
    Vote,
} from 'lucide-react'
import { Suspense, useMemo, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { z } from 'zod'
import { pCenterTableStore } from '@/shared/stores'
import ProjectCenterTable from '@/shared/components/project-center/ProjectCenterTable'
import AddAttachmentsModal from '@/shared/components/project-center/AddAttachmentsModal'
import { ViewColumnsDrawer } from '@/shared/components'
import JobDetailDrawer from '@/shared/components/job-detail/JobDetailDrawer'
import AssignMemberModal from '@/shared/components/project-center/AssignMemberModal'
import { JobColumnKey, TJob } from '../../../shared/types'
import dayjs from 'dayjs'

const DEFAULT_SORT = 'displayName:asc'

export const projectCenterParamsSchema = z
    .object({
        sort: z.string().optional().catch(DEFAULT_SORT),
        search: z.string().trim().optional(),
        limit: z.coerce.number().int().min(1).max(100).optional().catch(10),
        page: z.coerce.number().int().min(1).optional().catch(1),
    })
    .merge(jobFiltersSchema)

export type TProjectCenterSearch = z.infer<typeof projectCenterParamsSchema>

// =========================================================
// 1. ROUTE DEFINITION (Optimized Loader)
// =========================================================
export const Route = createFileRoute('/_workspace/project-center/$tab')({
    head: () => ({
        meta: [{ title: getPageTitle('Project Center') }],
    }),
    validateSearch: (search) => projectCenterParamsSchema.parse(search),
    parseParams: (params) => {
        const result = z.nativeEnum(ProjectCenterTabEnum).safeParse(params.tab)
        if (!result.success) {
            throw redirect({ href: '/project-center/priority' })
        }
        return { tab: result.data }
    },
    loaderDeps: ({ search }) => ({ search }),

    loader: async ({ context, deps, params }) => {
        // 1. Prefetch STATIC data (Users, Statuses)
        // We use Promise.all to fetch them in parallel without blocking the UI logic later
        await Promise.all([
            context.queryClient.ensureQueryData(jobStatusesListOptions()),
            context.queryClient.ensureQueryData(jobTypesListOptions()),
            context.queryClient.ensureQueryData(paymentChannelsListOptions()),
            context.queryClient.ensureQueryData(usersListOptions()),
        ])

        // 2. Prefetch DYNAMIC data (The Job List)
        // We intentionally DO NOT await this.
        // This allows the page to transition immediately and show a skeleton/spinner
        // if the data isn't ready, rather than freezing the browser navigation.
        const {
            limit = 10,
            page = 1,
            search,
            sort = DEFAULT_SORT,
        } = deps.search

        // Check local storage for hidden items preference (Server-side safe check)
        let hideFinishItems: '1' | '0' = '1'
        if (typeof window !== 'undefined') {
            const val = localStorage.getItem(
                STORAGE_KEYS.projectCenterFinishItems
            )
            hideFinishItems = val === 'true' ? '1' : '0'
        }

        void context.queryClient.ensureQueryData(
            jobsListOptions({
                limit,
                page,
                search,
                sort: [sort],
                tab: params.tab,
                hideFinishItems,
            })
        )
    },

    component: ProjectCenterPage,
})

// =========================================================
// 2. PARENT COMPONENT
// =========================================================
export function ProjectCenterPage() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()
    const { tab } = Route.useParams()

    const [localShowFinishItems, setLocalShowFinishItems] = useLocalStorage(
        STORAGE_KEYS.projectCenterFinishItems,
        false
    )

    // Navigation: Using 'replace' prevents history stack pollution
    const updateParams = (newParams: Partial<TProjectCenterSearch>) => {
        navigate({
            search: (old) => ({ ...old, ...newParams }),
            replace: true,
        })
    }

    const handleTabChange = (newTab: ProjectCenterTabEnum) => {
        navigate({
            to: '/project-center/$tab',
            params: { tab: newTab },
            search: (old) => ({ ...old, page: 1 }),
            replace: true,
        })
    }

    const handleApplyFilters = (newFilters: TJobFilters) => {
        navigate({
            search: (prev) => ({ ...prev, ...newFilters }),
            replace: true,
        })
    }

    return (
        <div className="size-full space-y-5">
            <ProjectCenterTabs onTabChange={handleTabChange} defaultTab={tab} />

            {/* Optimization:
          We wrap the content in Suspense, but inside the content 
          we use `useQuery` with `keepPreviousData` for the list.
          This ensures the Table header/structure stays visible during pagination.
      */}
            <Suspense fallback={<TableLoadingFallback />}>
                <ProjectCenterTableContent
                    tab={tab}
                    search={search}
                    localShowFinishItems={localShowFinishItems}
                    setLocalShowFinishItems={setLocalShowFinishItems}
                    onFiltersChange={handleApplyFilters}
                    onPageChange={(p: number) => updateParams({ page: p })}
                    onSortChange={(s?: string) =>
                        updateParams({ sort: s, page: 1 })
                    }
                    onLimitChange={(l: number) =>
                        updateParams({ limit: l, page: 1 })
                    }
                    onSearchChange={(s?: string) =>
                        updateParams({ search: s || undefined, page: 1 })
                    }
                />
            </Suspense>
        </div>
    )
}

// =========================================================
// 3. OPTIMIZED DATA COMPONENT
// =========================================================
function ProjectCenterTableContent({
    tab,
    search,
    localShowFinishItems,
    setLocalShowFinishItems,
    onPageChange,
    onSortChange,
    onLimitChange,
    onSearchChange,
    onFiltersChange,
}: {
    tab: ProjectCenterTabEnum
    search: TProjectCenterSearch
    localShowFinishItems: boolean
    setLocalShowFinishItems: (s: boolean) => void
    onPageChange: (p: number) => void
    onSortChange: (s?: string) => void
    onLimitChange: (l: number) => void
    onSearchChange: (s?: string) => void
    onFiltersChange: (newFilters: TJobFilters) => void
}) {
    const [selectedJob, setSelectedJob] = useState<string | null>(null)

    // 1. Main Job List Query (SWITCHED TO useQuery)
    // `useQuery` + `placeholderData: keepPreviousData` = No Lag/Flash during pagination
    const { data, isFetching, refetch } = useQuery({
        ...jobsListOptions({
            ...search,
            tab,
            hideFinishItems: Boolean(localShowFinishItems) ? '1' : '0',
        }),
        placeholderData: keepPreviousData,
    })

    // Memoize pagination to prevent unnecessary re-renders of child components
    const pagination = useMemo(
        () => ({
            limit: data?.paginate?.limit ?? 10,
            page: data?.paginate?.page ?? 1,
            totalPages: data?.paginate?.totalPages ?? 1,
            total: data?.paginate?.total ?? 0,
        }),
        [data?.paginate]
    )

    const filters: TJobFilters = {
        assignee: search.assignee,
        status: search.status,
        clientName: search.clientName,
        completedAtFrom: search.completedAtFrom,
        completedAtTo: search.completedAtTo,
        createdAtFrom: search.createdAtFrom,
        createdAtTo: search.createdAtTo,
        dueAtFrom: search.dueAtFrom,
        dueAtTo: search.dueAtTo,
        finishedAtFrom: search.finishedAtFrom,
        finishedAtTo: search.finishedAtTo,
        incomeCostMax: search.incomeCostMax,
        incomeCostMin: search.incomeCostMin,
        paymentChannel: search.paymentChannel,
        staffCostMax: search.staffCostMax,
        staffCostMin: search.staffCostMin,
        type: search.type,
    }

    const jobColumns = useStore(pCenterTableStore, (state) => state.jobColumns)

    // -- Modal Management (Cleaned up) --
    const viewColDisclosure = useDisclosure({ id: 'ViewColumnDrawer' })
    const jobDetailDisclosure = useDisclosure({ id: 'JobDetailDrawer' })
    const assignMemberDisclosure = useDisclosure({ id: 'AssignMemberModal' })
    const attachmentsDisclosure = useDisclosure({ id: 'AddAttachmentsModal' })

    const handleAssignMember = (jobNo: string) => {
        setSelectedJob(jobNo)
        assignMemberDisclosure.onOpen()
    }

    const handleAddAttachments = (jobNo: string) => {
        setSelectedJob(jobNo)
        attachmentsDisclosure.onOpen()
    }

    const handleOpenDetail = (jobNo: string) => {
        // Assuming you need this
        setSelectedJob(jobNo)
        jobDetailDisclosure.onOpen()
    }

    const handleExport = async () => {
        const showColumns: JobColumnKey[] = [
            'no',
            'displayName',
            'clientName',
            'assignee',
            'incomeCost',
            'staffCost',
            'type',
            'status',
            'dueAt',
            'completedAt',
            'createdAt',
            'updatedAt',
            'isPaid',
            'paymentChannel',
        ]

        try {
            const data = (await jobApi
                .findAll({
                    ...search,
                    tab,
                    isAll: '1',
                })
                .then((res) => res.result?.data)) as TJob[]

            const payload: TDownloadExcelInput = {
                columns: JOB_COLUMNS.filter((item) =>
                    showColumns.includes(item.uid)
                ).map((col) => ({
                    header: col.displayName,
                    key: col.uid,
                })),

                data: data.map((item) => {
                    return {
                        no: item.no,
                        displayName: item.displayName,
                        clientName: item.clientName,
                        assignee: item.assignee
                            .map((item) => item.displayName)
                            .join(', '),
                        incomeCost: item.incomeCost,
                        staffCost: item.staffCost,
                        type: item.type.displayName,
                        status: item.status.displayName,
                        dueAt: item.dueAt,
                        completedAt: item.completedAt,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                        isPaid: item.isPaid ? 'Yes' : 'No',
                        paymentChannel: item.paymentChannel?.displayName,
                    }
                }),
            }

            const response = await excelApi.download(payload)

            // Create a URL for the blob and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]))

            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'export_data.xlsx') // Filename
            document.body.appendChild(link)
            link.click()

            // Cleanup
            link.parentNode?.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Download failed', error)
        }
    }

    return (
        <>
            {/* Drawers & Modals: Only render if open to save resources */}
            {viewColDisclosure.isOpen && (
                <ViewColumnsDrawer
                    isOpen={true}
                    onClose={viewColDisclosure.onClose}
                />
            )}

            {jobDetailDisclosure.isOpen && selectedJob && (
                <JobDetailDrawer
                    jobNo={selectedJob}
                    isOpen={true}
                    onClose={jobDetailDisclosure.onClose}
                />
            )}

            {assignMemberDisclosure.isOpen && selectedJob && (
                <AssignMemberModal
                    jobNo={selectedJob}
                    isOpen={true}
                    onClose={assignMemberDisclosure.onClose}
                />
            )}

            {attachmentsDisclosure.isOpen && selectedJob && (
                <AddAttachmentsModal
                    jobNo={selectedJob}
                    isOpen={true}
                    onClose={attachmentsDisclosure.onClose}
                />
            )}

            <ProjectCenterTable
                // Data Props
                data={data?.jobs ?? []}
                isLoadingData={isFetching}
                pagination={pagination}
                searchKeywords={search.search}
                sort={search.sort}
                visibleColumns={jobColumns}
                showFinishItems={localShowFinishItems}
                // Actions
                onRefresh={refetch}
                onDownloadCsv={handleExport}
                // Modal Triggers
                openViewColDrawer={viewColDisclosure.onOpen}
                openJobDetailDrawer={handleOpenDetail} // Updated to set selectedJob
                onAssignMember={handleAssignMember}
                onAddAttachments={handleAddAttachments}
                onShowFinishItemsChange={setLocalShowFinishItems}
                // Navigation / Filter Actions
                onFiltersChange={onFiltersChange}
                onPageChange={onPageChange}
                onSearchKeywordsChange={onSearchChange}
                onSortChange={onSortChange}
                onLimitChange={onLimitChange}
                // Pass the static data if your table needs it for dropdowns
                // users={users}
                // statuses={jobStatuses}
                filters={filters}
            />
        </>
    )
}

// =========================================================
// 4. UI HELPERS (Unchanged)
// =========================================================
function TableLoadingFallback() {
    return (
        <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-divider bg-content1/50">
            <Spinner size="lg" color="primary" label="Loading data..." />
        </div>
    )
}

function ProjectCenterTabs({ defaultTab, onTabChange }: any) {
    const { isAdmin } = useProfile()
    return (
        <Tabs
            aria-label="Project Tabs"
            color="primary"
            size="sm"
            variant="bordered"
            selectedKey={defaultTab}
            onSelectionChange={(key) =>
                onTabChange(key as ProjectCenterTabEnum)
            }
            classNames={{ tabWrapper: 'border-[1px]', tabList: 'border-1' }}
        >
            <Tab
                key={ProjectCenterTabEnum.PRIORITY}
                title={<TabTitle icon={PinIcon} label="Priority" rotate />}
            />
            <Tab
                key={ProjectCenterTabEnum.ACTIVE}
                title={<TabTitle icon={Vote} label="Active" />}
            />
            <Tab
                key={ProjectCenterTabEnum.LATE}
                title={<TabTitle icon={ClockAlert} label="Late" />}
            />
            <Tab
                key={ProjectCenterTabEnum.DELIVERED}
                title={<TabTitle icon={Truck} label="Delivered" />}
            />
            <Tab
                key={ProjectCenterTabEnum.COMPLETED}
                title={<TabTitle icon={CircleCheckBig} label="Completed" />}
            />
            {isAdmin && (
                <Tab
                    key={ProjectCenterTabEnum.CANCELLED}
                    title={<TabTitle icon={SquareX} label="Canceled" />}
                />
            )}
        </Tabs>
    )
}

const TabTitle = ({ icon: Icon, label, rotate }: any) => (
    <div className="flex items-center space-x-2">
        <Icon size={16} className={rotate ? 'rotate-45' : ''} />
        <span>{label}</span>
    </div>
)
