'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios'
import { User } from '@/shared/interfaces/user.interface'
import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { userApi } from '@/app/api/user.api'
import {
    CreateUserInput,
    UpdateUserInput,
} from '@/shared/validationSchemas/user.schema'
import { UpdatePasswordInput } from '@/shared/validationSchemas/auth.schema'

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

export const useCreateUser = (onSuccess?: (data?: User) => void) => {
    return useMutation({
        mutationFn: async (data: CreateUserInput) => {
            const res = await userApi.create(data)
            return res.data.result
        },
        onSuccess: (user) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            onSuccess?.(user)
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
