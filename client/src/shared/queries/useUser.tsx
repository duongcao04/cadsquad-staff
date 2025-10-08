'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios'
import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { userApi } from '@/app/api/user.api'
import {
    CreateUserInput,
    UpdateUserInput,
} from '@/shared/validationSchemas/user.schema'
import { UpdatePasswordInput } from '@/shared/validationSchemas/auth.schema'

export const useUsers = () => {
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['users'],
        queryFn: () => userApi.findAll(),
        select: (res) => res.data.result,
    })
    return {
        users: data,
        isLoading: isLoading || isFetching,
    }
}

export const useUpdateUserMutation = () => {
    return useMutation({
        mutationKey: ['updateUser'],
        mutationFn: ({
            userId,
            updateUserInput,
        }: {
            userId?: string
            updateUserInput: UpdateUserInput
        }) => {
            return axiosClient.patch(`users/${userId}`, updateUserInput)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['profile'],
            })
        },
    })
}

export const useUpdatePasswordMutation = () => {
    return useMutation({
        mutationKey: ['updatePassword'],
        mutationFn: ({
            updatePasswordInput,
        }: {
            updatePasswordInput: UpdatePasswordInput
        }) => {
            return userApi.updatePassword(updatePasswordInput)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['profile'],
            })
        },
    })
}

export const useCreateUser = () => {
    return useMutation({
        mutationFn: async (data: CreateUserInput) => await userApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })
}

// Mutation: Xóa user
export const useDeleteUser = (onSuccess?: () => void) => {
    return useMutation({
        mutationFn: async (id: string) => {
            await userApi.remove(id)
            return id
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            onSuccess?.()
        },
    })
}
