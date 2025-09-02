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

export const useJobStatusDetail = (statusId?: string) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: statusId ? ['jobStatus', statusId] : ['jobStatus'],
        queryFn: () =>
            axiosClient.get<ApiResponse<JobStatus>>(`job-statuses/${statusId}`),
        enabled: !!statusId,
        select: (res) => res.data,
    })
    return {
        refetch,
        jobStatus: data?.result,
        error,
        isLoading,
    }
}
