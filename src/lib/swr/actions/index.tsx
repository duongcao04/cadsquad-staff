import { mutate } from 'swr'
import useSWRMutation from 'swr/mutation'

export const clearCache = () =>
    mutate(() => true, undefined, { revalidate: false })

export function useCreateMutation<T = unknown>(
    url: string,
    options?: RequestInit
) {
    return useSWRMutation(
        url,
        async (url: string, { arg }: { arg: T }) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                body: JSON.stringify(arg),
                ...options,
            })

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`
                )
            }

            // Tell all SWRs with this key to revalidate
            mutate(url)

            return response.json()
        },
        {
            revalidate: true,
        }
    )
}
