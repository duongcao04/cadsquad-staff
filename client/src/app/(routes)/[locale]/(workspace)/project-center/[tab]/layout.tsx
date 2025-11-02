import { PROJECT_CENTER_TABS } from '@/lib/utils'
import NotFound from '../../../[...rest]/page'

const validTabs = new Set(Object.values(PROJECT_CENTER_TABS))
async function ensureTabIsValid(tab: string) {
    // pretend we check/prepare something async
    await Promise.resolve()
    if (!validTabs.has(tab)) NotFound()
}

type Props = {
    children: React.ReactNode
    params: Promise<{ locale: string; tab: string }>
}
export default async function ProjectCenterTabLayout({
    children,
    params,
}: Props) {
    const { tab } = await params
    await ensureTabIsValid(tab)

    return children
}
