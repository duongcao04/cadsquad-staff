'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios'
import { User } from '@/shared/interfaces/user.interface'
import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { userApi } from '@/app/api/user.api'

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => userApi.findAll(),
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
