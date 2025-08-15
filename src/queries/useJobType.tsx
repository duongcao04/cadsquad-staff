'use client'

import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { ApiResponse, axiosClient } from "@/lib/axios"
import { JobType } from "@/validationSchemas/project.schema"

export const useJobTypes = () => {
	return useQuery({ queryKey: ['jobTypes'], queryFn: () => axiosClient.get<ApiResponse<JobType[]>>('job-types'), select: (res) => res.data.result })
}