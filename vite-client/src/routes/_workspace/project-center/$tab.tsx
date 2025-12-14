import { ProjectCenterTabEnum } from '@/shared/enums'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { jobsListOptions } from '../../../lib/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import ProjectCenterTableView from '../../../shared/components/project-center/ProjectCenterTableView'

export const projectCenterParamsSchema = z.object({
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

export const Route = createFileRoute('/_workspace/project-center/$tab')({
    validateSearch: (search) => projectCenterParamsSchema.parse(search),
    loaderDeps: ({ search }) => ({ search }),
    loader: ({ context, deps }) => {
        // Prefetch dữ liệu
        return context.queryClient.ensureQueryData(jobsListOptions(deps.search))
    },

    component: ProjectCenterPage,
})

export function ProjectCenterPage() {
    // 1. Lấy Search Params (Đã được validate & type-safe)
    const search = Route.useSearch()

    const { tab } = Route.useParams()

    // 2. Tạo Query Options từ search params
    const options = jobsListOptions(search)

    // 3. Dùng useSuspenseQuery để lấy data
    // Không cần check isLoading vì đã có
    const { data } = useSuspenseQuery(options)

    return <ProjectCenterTableView tab={tab} />
}
