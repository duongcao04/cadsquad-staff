'use client'

import { useQuery } from "@tanstack/react-query"
import { ApiResponse, axiosClient } from "@/lib/axios"
import { User } from "@/validationSchemas/user.schema"

export const useUsers = () => {
	return useQuery({ queryKey: ['users'], queryFn: () => axiosClient.get<ApiResponse<User[]>>('users'), select: (res) => res.data.result })
}