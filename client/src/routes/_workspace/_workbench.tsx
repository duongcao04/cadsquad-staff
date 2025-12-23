import { PageHeading } from '@/shared/components'
import WorkbenchTableView from '@/shared/components/workbench/WorkbenchTableView'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { workbenchDataOptions } from '../../lib/queries'
import AppLoading from '../../shared/components/app/AppLoading'
import { getPageTitle } from '../../lib'

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
            {
                title: getPageTitle('Workbench Dashboard'),
            },
            {
                name: 'description',
                content:
                    'A high-level overview of your active tasks, upcoming deadlines, and personal performance.',
            },
        ],
    }),
    validateSearch: (search) => workbenchParamsSchema.parse(search),
    loaderDeps: ({ search }) => ({ search }),
    pendingComponent: () => <AppLoading />,
    loader: ({ context, deps }) => {
        const {
            limit = 10,
            page = 1,
            search,
            sort = DEFAULT_SORT,
        } = deps.search
        return context.queryClient.ensureQueryData(
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
    const {
        limit = 10,
        page = 1,
        search,
        sort = DEFAULT_SORT,
    } = Route.useSearch()
    const navigate = Route.useNavigate()

    const options = workbenchDataOptions({
        limit,
        page,
        search,
        sort: [sort],
    })

    const { data, refetch, isPending } = useSuspenseQuery(options)

    const handlePageChange = (newPage: number) => {
        navigate({
            // Bây giờ 'old' sẽ có kiểu dữ liệu chính xác thay vì 'never'
            search: (old: TWorkbenchSearch) => {
                return {
                    ...old,
                    page: newPage,
                } as never
            },
            replace: true,
        })
    }
    const handleSortChange = (newSort: string | null) => {
        navigate({
            search: (old: TWorkbenchSearch) => {
                return {
                    ...old,
                    sort: newSort || undefined, // Nếu null thì xóa sort (về default)
                    page: 1, // Reset về trang 1
                } as never
            },
            replace: true,
        })
    }
    const handleLimitChange = (newLimit: number) => {
        navigate({
            search: (old: TWorkbenchSearch) => {
                return {
                    ...old,
                    limit: newLimit,
                    page: 1, // Reset về trang 1
                } as never
            },
            replace: true,
        })
    }
    const handleSearchChange = (newSearch?: string) => {
        navigate({
            search: (old: TWorkbenchSearch) => {
                return {
                    ...old,
                    search: newSearch,
                    page: 1, // Reset về trang 1
                } as never
            },
            replace: true,
        })
    }

    return (
        <WorkbenchLayout>
            <WorkbenchTableView
                data={data.jobs}
                isDataLoading={isPending}
                onRefresh={refetch}
                sort={sort}
                onSortChange={handleSortChange}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                pagination={{
                    limit: limit,
                    page: page,
                    totalPages: data.paginate?.totalPages ?? 1,
                }}
                search={search}
                onSearchChange={handleSearchChange}
            />
        </WorkbenchLayout>
    )
}

function WorkbenchLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PageHeading
                title="Workbench"
                classNames={{
                    wrapper: '!py-3 pl-6 pr-3.5 border-b border-border-default',
                }}
            />
            <div className="size-full pl-5 pr-3.5 pt-5">{children}</div>
        </>
    )
}
