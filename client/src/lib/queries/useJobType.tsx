'use client'

import { useQuery } from '@tanstack/react-query'
import { jobTypeApi } from '@/lib/api'

export const useJobTypes = () => {
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['jobTypes'],
        queryFn: () => jobTypeApi.findAll(),
        select: (res) => res.data.result,
    })
    return {
        data,
        isLoading: isLoading || isFetching,
    }
}

export const useJobTypeDetail = (typeId?: string) => {
    const { data, refetch, error, isLoading, isFetching } = useQuery({
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
        isLoading: isLoading || isFetching,
    }
}
