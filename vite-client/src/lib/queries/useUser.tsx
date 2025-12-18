import { addToast } from '@heroui/react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { userApi } from '@/lib/api'
import { ApiResponse, type ApiError } from '@/lib/axios'
import type { IUserResponse } from '@/shared/interfaces'
import type { TUser } from '@/shared/types'

import { queryClient } from '../../main'
import { IMAGES } from '../utils'
import type {
    TCreateUserInput,
    TResetPasswordInput,
    TUpdatePasswordInput,
    TUpdateUserInput,
} from '../validationSchemas'
import { usersListOptions } from './options/user-queries'

export const mapUser: (item: IUserResponse) => TUser = (item) => ({
    id: item.id,

    displayName: item.displayName ?? 'Unknown User',
    avatar: item.avatar ?? IMAGES.emptyAvatar,
    email: item.email,
    username: item.username,
    phoneNumber: item.phoneNumber,

    department: item.department,
    jobTitle: item.jobTitle,

    isActive: Boolean(item.isActive),

    role: item.role,

    files: item.files ?? [],
    accounts: item.accounts ?? [],
    notifications: item.notifications ?? [],
    configs: item.configs ?? [],
    filesCreated: item.filesCreated ?? [],
    jobActivityLog: item.jobActivityLog ?? [],
    jobsAssigned: item.jobsAssigned ?? [],
    jobsCreated: item.jobsCreated ?? [],
    sendedNotifications: item.sendedNotifications ?? [],

    lastLoginAt: item.lastLoginAt ? new Date(item.lastLoginAt) : null,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
})

export const useUsers = () => {
    // Gọi Options
    const options = usersListOptions()

    const { data, refetch, error, isFetching, isLoading } = useQuery(options)

    // Data đã được map sẵn trong options.select
    return {
        refetch,
        isLoading: isLoading || isFetching,
        error,
        data: data?.users ?? [],
    }
}

export const useUpdateUserMutation = (
    onSuccess?: (res: ApiResponse<{ id: string; username: string }>) => void
) => {
    return useMutation({
        mutationKey: ['updateUser'],
        mutationFn: ({
            userId,
            updateUserInput,
        }: {
            userId: string
            updateUserInput: TUpdateUserInput
        }) => {
            return userApi.update(userId, updateUserInput)
        },
        onSuccess: (res) => {
            if (onSuccess) {
                onSuccess?.(res)
            } else {
                addToast({
                    title: 'Update user successfully',
                    color: 'success',
                })
            }
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
        onSuccess: (res) => {
            addToast({
                title: 'Reset password successfully',
                description: res.data.message,
                color: 'success',
            })

            queryClient.invalidateQueries({
                queryKey: ['profile'],
            })
        },
        onError: (error) => {
            const err = error as unknown as ApiError
            addToast({
                title: 'Reset password failed',
                description: err.message,
                color: 'danger',
            })
        },
    })
}

export const useCreateUserMutation = () => {
    return useMutation({
        mutationFn: async (data: TCreateUserInput) =>
            await userApi.create(data),
        onSuccess: () => {
            addToast({
                title: 'Tạo mới thành công',
                color: 'success',
            })
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error) => {
            const errorRes = error as unknown as ApiError
            addToast({
                title: errorRes.error,
                description: `Error: ${errorRes.message}`,
                color: 'danger',
            })
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
        onError(error) {
            const err = error as unknown as ApiError
            addToast({
                title: 'Delete user failed',
                description: err.message,
                color: 'danger',
            })
        },
    })
}
