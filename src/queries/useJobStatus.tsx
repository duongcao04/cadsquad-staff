import { useQuery } from '@tanstack/react-query'
import { ApiResponse, axiosClient } from '../lib/axios'
import { JobStatus } from '../validationSchemas/job.schema'

export const useJobStatuses = () => {
    return useQuery({
        queryKey: ['jobStatuses'],
        queryFn: () => axiosClient.get('job-statuses'),
        select: (res) => res.data,
    })
}

export const useJobStatusDetail = (id: string) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: ['jobStatus', id],
        queryFn: () =>
            axiosClient.get<ApiResponse<JobStatus>>(`job-statuses/${id}`),
        enabled: id !== null && id !== undefined,
        select: (res) => res.data,
    })
    return {
        refetch,
        jobStatus: data?.result,
        error,
        isLoading,
    }
}
