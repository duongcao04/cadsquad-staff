'use client'

import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { userApi } from '@/lib/api'
import { axiosClient } from '@/lib/axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
    TCreateUserInput,
    TResetPasswordInput,
    TUpdatePasswordInput,
    TUpdateUserInput,
} from '../validationSchemas'

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
            updateUserInput: TUpdateUserInput
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
            updatePasswordInput: TUpdatePasswordInput
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

export const useResetPasswordMutation = () => {
    return useMutation({
        mutationKey: ['resetPassword'],
        mutationFn: ({
            userId,
            resetPasswordInput,
        }: {
            userId: string
            resetPasswordInput: TResetPasswordInput
        }) => {
            return userApi.resetPassword(userId, resetPasswordInput)
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
        mutationFn: async (data: TCreateUserInput) =>
            await userApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })
}

// Mutation: Xóa user
export const useDeleteUser = () => {
    return useMutation({
        mutationFn: async (id: string) => await userApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })
}
