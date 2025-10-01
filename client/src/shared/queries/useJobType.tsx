'use client'

import { useQuery } from '@tanstack/react-query'
import { jobTypeApi } from '@/app/api/jobType.api'

export const useJobTypes = () => {
    return useQuery({
        queryKey: ['jobTypes'],
        queryFn: () => jobTypeApi.findAll(),
        select: (res) => res.data.result,
    })
}

export const useJobTypeDetail = (typeId?: string) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: typeId ? ['jobTypes', typeId] : ['jobTypes'],
        queryFn: () => {
            if (!typeId) {
                return undefined
            }
            return jobTypeApi.findOne(typeId)
        },
        enabled: !!typeId,
        select: (res) => res?.data.result,
    })
    return {
        refetch,
        jobType: data,
        error,
        isLoading,
    }
}
