import { SYSTEM_ROUTES } from '@/lib/utils' // Assuming you have this
import { queryOptions } from '@tanstack/react-query'

export type SearchCategory =
    | 'All'
    | 'Jobs'
    | 'Clients'
    | 'System'
    | 'Communities'
    | 'Staff Members'

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Search request failed')
    return res.json()
}

export const searchOptions = (query: string, category: SearchCategory) => {
    return queryOptions({
        queryKey: ['search', category, query],
        queryFn: async () => {
            if (!query.trim()) return []

            const promises: Promise<any>[] = []
            const results: any[] = []

            // 1. System Routes (Static Filter)
            if (category === 'All' || category === 'System') {
                const lowerQuery = query.toLowerCase()
                const systemMatches = SYSTEM_ROUTES.filter(
                    (route) =>
                        route.title.toLowerCase().includes(lowerQuery) ||
                        route.subtitle?.toLowerCase().includes(lowerQuery)
                ).map((route) => ({
                    ...route,
                    id: `system-${route.route}`,
                    type: 'System',
                }))
                results.push(...systemMatches)
            }

            // 2. Jobs
            if (category === 'All' || category === 'Jobs') {
                promises.push(
                    fetcher(`/api/jobs/search?q=${encodeURIComponent(query)}`)
                        .then((data) =>
                            data.map((item: any) => ({
                                id: `job-${item.id}`,
                                title: item.displayName || item.no,
                                subtitle: item.client?.name || 'Unknown Client',
                                type: 'Jobs',
                                route: `/jobs/${item.no}`,
                                rawData: item,
                            }))
                        )
                        .catch(() => [])
                )
            }

            // 3. Clients
            if (category === 'All' || category === 'Clients') {
                promises.push(
                    fetcher(
                        `/api/clients/search?q=${encodeURIComponent(query)}`
                    )
                        .then((data) =>
                            data.map((item: any) => ({
                                id: `client-${item.id}`,
                                title: item.name,
                                subtitle: item.code,
                                type: 'Clients',
                                route: `/clients/${item.id}`,
                                rawData: item,
                            }))
                        )
                        .catch(() => [])
                )
            }

            // 4. Communities
            if (category === 'All' || category === 'Communities') {
                promises.push(
                    fetcher(
                        `/api/communities/search?q=${encodeURIComponent(query)}`
                    )
                        .then((data) =>
                            data.map((item: any) => ({
                                id: `comm-${item.id}`,
                                title: item.name,
                                subtitle: `${item.membersCount} members`,
                                type: 'Communities',
                                route: `/communities/${item.id}`,
                                rawData: item,
                            }))
                        )
                        .catch(() => [])
                )
            }

            // 5. Staff Members
            if (category === 'All' || category === 'Staff Members') {
                promises.push(
                    fetcher(`/api/staff/search?q=${encodeURIComponent(query)}`)
                        .then((data) =>
                            data.map((item: any) => ({
                                id: `staff-${item.id}`,
                                title: item.displayName,
                                subtitle: item.email, // or role
                                type: 'Staff Members',
                                route: `/staff/${item.id}`,
                                rawData: item,
                            }))
                        )
                        .catch(() => [])
                )
            }

            const apiResults = await Promise.all(promises)

            // Flatten API results and combine with System results
            apiResults.forEach((group) => results.push(...group))

            return results
        },
        enabled: !!query.trim(),
        staleTime: 1000 * 60 * 2,
    })
}
