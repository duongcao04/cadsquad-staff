'use client'

import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { userApi } from '@/lib/api'
import { axiosClient } from '@/lib/axios'
import {
    ResetPasswordInput,
    UpdatePasswordInput,
} from '@/lib/validationSchemas/auth.schema'
import {
    CreateUserInput,
    UpdateUserInput,
} from '@/lib/validationSchemas/user.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

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

export const useResetPasswordMutation = () => {
    return useMutation({
        mutationKey: ['resetPassword'],
        mutationFn: ({
            userId,
            resetPasswordInput,
        }: {
            userId: string
            resetPasswordInput: ResetPasswordInput
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
        mutationFn: async (data: CreateUserInput) => await userApi.create(data),
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
