import { getPageTitle, STORAGE_KEYS } from '@/lib'
import { jobColumnsOptions, jobsListOptions, useProfile } from '@/lib/queries'
import ProjectCenterTableView from '@/shared/components/project-center/ProjectCenterTableView'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { Spinner, Tab, Tabs } from '@heroui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import {
    CircleCheckBig,
    ClockAlert,
    PinIcon,
    SquareX,
    Truck,
    Vote,
} from 'lucide-react'
import { Suspense } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { z } from 'zod'

const DEFAULT_SORT = 'displayName:asc'

export const projectCenterParamsSchema = z.object({
    sort: z.string().optional().catch(DEFAULT_SORT),
    search: z.string().trim().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().catch(10),
    page: z.coerce.number().int().min(1).optional().catch(1),
})

export type TProjectCenterSearch = z.infer<typeof projectCenterParamsSchema>

// =========================================================
// 1. ROUTE DEFINITION
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

    // 🔥 CRITICAL FIX: Non-blocking loader
    loader: ({ context, deps, params }) => {
        // 1. Get local storage logic
        let hideFinishItems: '1' | '0' = '1'
        if (typeof window !== 'undefined') {
            const storageValue = localStorage.getItem(
                STORAGE_KEYS.projectCenterFinishItems
            )
            hideFinishItems = storageValue === 'true' ? '1' : '0'
        }

        const {
            limit = 10,
            page = 1,
            search,
            sort = DEFAULT_SORT,
        } = deps.search

        // 2. Prefetch data but DO NOT 'return' or 'await' it.
        // Use 'void' to tell Router: "Don't wait for me, render the component NOW!"
        context.queryClient.ensureQueryData(jobColumnsOptions())

        void context.queryClient.ensureQueryData(
            jobsListOptions({
                limit,
                page,
                search,
                sort: [sort],
                tab: params.tab,
                hideFinishItems: hideFinishItems,
            })
        )
    },

    component: ProjectCenterPage,
})

// =========================================================
// 2. PARENT COMPONENT (Layout & Tabs)
// =========================================================
export function ProjectCenterPage() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()
    const { tab } = Route.useParams()

    const [localShowFinishItems, setLocalShowFinishItems] = useLocalStorage(
        STORAGE_KEYS.projectCenterFinishItems,
        false
    )

    // -- Navigation Helpers --
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
            search: (old) => ({ ...old, page: 1 }), // Reset page on tab change
            replace: true,
        })
    }

    return (
        <div className="size-full space-y-5">
            {/* 🚀 1. Tabs Render INSTANTLY (because loader didn't block) */}
            <ProjectCenterTabs onTabChange={handleTabChange} defaultTab={tab} />

            {/* 🚀 2. Table Area shows Spinner until data arrives */}
            <Suspense fallback={<TableLoadingFallback />}>
                <ProjectCenterTableContent
                    tab={tab}
                    search={search}
                    localShowFinishItems={localShowFinishItems}
                    setLocalShowFinishItems={setLocalShowFinishItems}
                    onPageChange={(p: number) => updateParams({ page: p })}
                    onSortChange={(s: string) =>
                        updateParams({ sort: s, page: 1 })
                    }
                    onLimitChange={(l: number) =>
                        updateParams({ limit: l, page: 1 })
                    }
                    onSearchChange={(s: string) =>
                        updateParams({ search: s || undefined, page: 1 })
                    }
                />
            </Suspense>
        </div>
    )
}

// =========================================================
// 3. CHILD COMPONENT (Data Fetching)
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
}: any) {
    // Query options
    const options = jobsListOptions({
        ...search,
        tab,
        hideFinishItems: Boolean(localShowFinishItems) ? '1' : '0',
    })

    // 🛑 This hook will SUSPEND this specific component if data isn't ready
    const { data, refetch, isFetching } = useSuspenseQuery(options)

    const pagination = {
        limit: data.paginate?.limit ?? 10,
        page: data.paginate?.page ?? 1,
        totalPages: data.paginate?.totalPages ?? 1,
        total: data.paginate?.total ?? 0,
    }

    return (
        <ProjectCenterTableView
            showFinishItems={localShowFinishItems}
            onShowFinishItemsChange={setLocalShowFinishItems}
            data={data.jobs}
            pagination={pagination}
            searchKeywords={search.search}
            sort={search.sort}
            isLoadingData={isFetching}
            onRefresh={refetch}
            onFiltersChange={() => {}}
            onPageChange={onPageChange}
            onSearchKeywordsChange={onSearchChange}
            onSortChange={onSortChange}
            onLimitChange={onLimitChange}
            filters={{}}
        />
    )
}

// =========================================================
// 4. UI HELPERS
// =========================================================

// This is the "Spinner" you asked for
function TableLoadingFallback() {
    return (
        <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-divider bg-content1/50">
            <Spinner size="lg" color="primary" label="Loading data..." />
        </div>
    )
}

function ProjectCenterTabs({
    defaultTab,
    onTabChange,
}: {
    defaultTab: ProjectCenterTabEnum
    onTabChange: (t: ProjectCenterTabEnum) => void
}) {
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
