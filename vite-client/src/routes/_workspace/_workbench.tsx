import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { PageHeading } from '@/shared/components'
import WorkbenchTableView from '@/shared/components/workbench/WorkbenchTableView'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { useSuspenseQuery } from '@tanstack/react-query'
import { jobsListOptions } from '../../lib/queries'

export const workbenchParamsSchema = z.object({
    sort: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .default(['displayName:asc'])
        .transform((val) => {
            if (Array.isArray(val)) return val
            return val ? val.split(',') : ['displayName:asc']
        }),

    tab: z
        .nativeEnum(ProjectCenterTabEnum)
        .optional()
        .default(ProjectCenterTabEnum.ACTIVE),

    search: z.string().trim().optional(),

    hideFinishItems: z.enum(['0', '1']).optional().default('0'),

    // Pagination (Using coerce to handle URL query string numbers)
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),

    page: z.coerce.number().int().min(1).optional().default(1),
})

export type TWorkbenchSearch = z.infer<typeof workbenchParamsSchema>

export const Route = createFileRoute('/_workspace/_workbench')({
    validateSearch: (search) => workbenchParamsSchema.parse(search),
    loaderDeps: ({ search }) => ({ search }),
    loader: ({ context, deps }) => {
        // Prefetch dữ liệu
        return context.queryClient.ensureQueryData(jobsListOptions(deps.search))
    },
    component: WorkbenchPage,
})

export function WorkbenchPage() {
    // 1. Lấy Search Params (Đã được validate & type-safe)
    const search = Route.useSearch()

    // 2. Tạo Query Options từ search params
    const options = jobsListOptions(search)

    // 3. Dùng useSuspenseQuery để lấy data
    // Không cần check isLoading vì đã có
    const { data } = useSuspenseQuery(options)

    return (
        <WorkbenchLayout>
            <WorkbenchTableView data={data.jobs} />
        </WorkbenchLayout>
    )
}

function WorkbenchLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background h-full flex flex-col">
            <div className="border-b border-border-default">
                <PageHeading
                    title="Workbench"
                    classNames={{
                        wrapper: '!py-3 pl-6 pr-3.5',
                    }}
                />
            </div>
            <div className="pl-5 pr-3.5 pt-5">{children}</div>
        </div>
    )
}
