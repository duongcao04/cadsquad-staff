import { addToast } from '@heroui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/api'
import { ApiResponse, type ApiError } from '@/lib/axios'
import { queryClient } from '../../main'
import type {
    TCreateUserInput,
    TResetPasswordInput,
    TUpdatePasswordInput,
    TUpdateUserInput,
} from '../validationSchemas'
import { userOptions, usersListOptions } from './options/user-queries'
import { onErrorToast } from './helper'

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
            username,
            data,
        }: {
            username: string
            data: TUpdateUserInput
        }) => {
            return userApi.update(username, data)
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

export const useUpdateAvatarMutation = (
    onSuccess?: (res: ApiResponse<{ id: string; username: string }>) => void
) => {
    return useMutation({
        mutationKey: ['updateUser', 'avatar'],
        mutationFn: ({
            username,
            avatarUrl,
        }: {
            username: string
            avatarUrl: string
        }) => {
            return userApi.update(username, {
                avatar: avatarUrl,
            })
        },
        onSuccess: async (res) => {
            const { username } = res.result!
            if (onSuccess) {
                onSuccess?.(res)
            } else {
                addToast({
                    title: 'Upload avatar successfully',
                    color: 'success',
                })
            }
            if (username) {
                await queryClient.invalidateQueries({
                    queryKey: userOptions(username).queryKey,
                })
            }
        },
    })
}

export const useUpdatePasswordMutation = (
    onSuccess?: (res: ApiResponse<{ username: string }>) => void
) => {
    return useMutation({
        mutationKey: ['updatePassword'],
        mutationFn: ({
            updatePasswordInput,
        }: {
            updatePasswordInput: TUpdatePasswordInput
        }) => {
            return userApi.updatePassword(updatePasswordInput)
        },
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({
                queryKey: ['profile'],
            })
            if (onSuccess) {
                onSuccess(res)
            } else {
                addToast({
                    title: 'Update password successfully',
                    color: 'success',
                })
            }
        },
        onError: (error) => onErrorToast(error, 'Update password failed'),
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
