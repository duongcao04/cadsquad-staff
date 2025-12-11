'use client'

import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { userApi } from '@/lib/api'
import { ApiError, axiosClient } from '@/lib/axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
    TCreateUserInput,
    TResetPasswordInput,
    TUpdatePasswordInput,
    TUpdateUserInput,
} from '../validationSchemas'
import { IUserResponse } from '../../shared/interfaces'
import { TUser } from '../../shared/types'
import { IMAGES } from '../utils'
import { addToast } from '@heroui/react'

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
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['users'],
        queryFn: () => userApi.findAll(),
        select: (res) => {
            // Giả sử API trả về cấu trúc: { data: { result: User[] } }
            // Nếu API trả về mảng trực tiếp thì bỏ .result
            const rawUsers = res.data?.result || []
            return rawUsers.map(mapUser)
        },

        // Giữ data cũ trong khi fetch mới để UI không bị nháy
        placeholderData: (previousData) => previousData,
    })
    return {
        data: data ?? [],
        users: data ?? [],
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
    })
}
