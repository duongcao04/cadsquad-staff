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
