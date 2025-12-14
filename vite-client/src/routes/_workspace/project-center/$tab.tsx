import { jobsListOptions, useProfile } from '@/lib/queries'
import ProjectCenterTableView from '@/shared/components/project-center/ProjectCenterTableView'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { Tab, Tabs } from '@heroui/react'
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
import { z } from 'zod'

const DEFAULT_SORT = 'displayName:asc'
// 1. Schema Definition
export const projectCenterParamsSchema = z.object({
    sort: z.string().optional().catch(DEFAULT_SORT).default(DEFAULT_SORT),
    search: z.string().trim().optional(),
    limit: z.coerce.number().int().min(1).max(100).catch(10).default(10),
    page: z.coerce.number().int().min(1).catch(1).default(1),
})

export type TProjectCenterSearch = z.infer<typeof projectCenterParamsSchema>

// 2. Route Definition
export const Route = createFileRoute('/_workspace/project-center/$tab')({
    // Validate Query String (?page=...)
    validateSearch: (search) => projectCenterParamsSchema.parse(search),

    // Validate Path Param (/$tab)
    parseParams: (params) => {
        // Try to parse the enum
        const result = z.nativeEnum(ProjectCenterTabEnum).safeParse(params.tab)

        // If invalid, throw a redirect to the default tab
        if (!result.success) {
            throw redirect({
                href: '/project-center/priority',
            })
        }

        // Return the valid data so strictly typed params are available below
        return {
            tab: result.data,
        }
    },

    // Dependency Tracking
    loaderDeps: ({ search }) => ({ search }),

    // Data Loading
    loader: ({ context, deps, params }) => {
        return context.queryClient.ensureQueryData(
            jobsListOptions({
                ...deps.search,
                tab: params.tab,
            })
        )
    },

    component: ProjectCenterPage,
})

export function ProjectCenterPage() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()
    const { tab } = Route.useParams()

    // Query Data
    const options = jobsListOptions({ ...search, tab })
    const { data, refetch, isFetching } = useSuspenseQuery(options)

    // --- HANDLERS (Đã fix Type Safe - Không cần 'as never') ---

    const handlePageChange = (newPage: number) => {
        navigate({
            search: (old) => ({ ...old, page: newPage }),
            replace: true,
        })
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

    const handleLimitChange = (newLimit: number) => {
        navigate({
            search: (old) => ({
                ...old,
                limit: newLimit,
                page: 1,
            }),
            replace: true,
        })
    }

    const handleSearchChange = (newSearch: string) => {
        navigate({
            search: (old) => ({
                ...old,
                search: newSearch || undefined, // Rỗng thì xóa khỏi URL
                page: 1,
            }),
            replace: true,
        })
    }

    const handleTabChange = (newTab: ProjectCenterTabEnum) => {
        navigate({
            to: '/project-center/$tab', // Explicit path giúp TS check params
            params: { tab: newTab },
            search: (old) => ({
                ...old,
                page: 1, // Chuyển tab thì reset trang
            }),
            replace: true,
        })
    }

    // --- RENDER ---

    // Fallback pagination an toàn để tránh crash nếu API lỗi
    const pagination = {
        limit: data.paginate?.limit ?? 10,
        page: data.paginate?.page ?? 1,
        totalPages: data.paginate?.totalPages ?? 1,
        total: data.paginate?.total ?? 0,
    }

    return (
        <div className="space-y-5">
            <ProjectCenterTabs
                onTabChange={handleTabChange}
                defaultTab={tab} // Tab đã được validate từ Route, không cần cast
            />
            <ProjectCenterTableView
                data={data.jobs}
                pagination={pagination}
                // State props
                searchKeywords={search.search}
                sort={search.sort}
                isLoadingData={isFetching}
                // Actions
                onRefresh={refetch}
                onFiltersChange={() => {}} // Chưa implement logic filter object?
                onPageChange={handlePageChange}
                onSearchKeywordsChange={handleSearchChange}
                onSortChange={handleSortChange}
                onLimitChange={handleLimitChange}
                filters={{}}
            />
        </div>
    )
}

// --- SUB COMPONENTS ---

function ProjectCenterTabs({
    defaultTab = ProjectCenterTabEnum.ACTIVE, // Dùng Enum làm default
    onTabChange,
}: {
    defaultTab?: ProjectCenterTabEnum
    onTabChange: (newTab: ProjectCenterTabEnum) => void
}) {
    const { isAdmin } = useProfile()

    return (
        <Tabs
            aria-label="Project Tabs"
            color="primary"
            size="sm"
            classNames={{
                tabWrapper: 'border-[1px]',
                tabList: 'border-1',
            }}
            variant="bordered"
            selectedKey={defaultTab}
            onSelectionChange={(key) =>
                onTabChange(key.toString() as ProjectCenterTabEnum)
            }
        >
            <Tab
                key={ProjectCenterTabEnum.PRIORITY} // Nên dùng Enum ở đây thay vì hardcode string 'priority'
                title={
                    <div className="flex items-center space-x-2">
                        <PinIcon size={16} className="rotate-45" />
                        <span>Priority</span>
                    </div>
                }
            />
            <Tab
                key={ProjectCenterTabEnum.ACTIVE}
                title={
                    <div className="flex items-center space-x-2">
                        <Vote size={16} />
                        <span>Active</span>
                    </div>
                }
            />
            <Tab
                key={ProjectCenterTabEnum.LATE}
                title={
                    <div className="flex items-center space-x-2">
                        <ClockAlert size={16} />
                        <span>Late</span>
                    </div>
                }
            />
            <Tab
                key={ProjectCenterTabEnum.DELIVERED}
                title={
                    <div className="flex items-center space-x-2">
                        <Truck size={16} />
                        <span>Delivered</span>
                    </div>
                }
            />
            <Tab
                key={ProjectCenterTabEnum.COMPLETED}
                title={
                    <div className="flex items-center space-x-2">
                        <CircleCheckBig size={16} />
                        <span>Completed</span>
                    </div>
                }
            />
            {isAdmin && (
                <Tab
                    key={ProjectCenterTabEnum.CANCELLED}
                    title={
                        <div className="flex items-center space-x-2">
                            <SquareX size={16} />
                            <span>Canceled</span>
                        </div>
                    }
                />
            )}
        </Tabs>
    )
}
