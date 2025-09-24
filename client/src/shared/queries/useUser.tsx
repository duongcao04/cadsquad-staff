'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { ApiResponse, axiosClient } from '@/lib/axios'
import { User } from '@/shared/interfaces/user.interface'
import { queryClient } from '@/app/providers/TanstackQueryProvider'

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => axiosClient.get<ApiResponse<User[]>>('users'),
        select: (res) => res.data.result,
    })
}

export const useUpdateUserMutation = () => {
    return useMutation({
        mutationKey: ['updateUser'],
        mutationFn: ({
            userId,
            updateUserInput,
        }: {
            userId?: string
            updateUserInput: Partial<User>
        }) => {
            return axiosClient.patch(`users/${userId}`, updateUserInput)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
            })
        },
    })
}
