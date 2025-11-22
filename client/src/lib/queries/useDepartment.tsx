'use client'

import { departmentApi } from '@/lib/api'
import {
    TCreateDepartmentInput,
    TUpdateDepartmentInput,
} from '@/lib/validationSchemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useDepartments = () => {
    const { data, isFetching, isLoading } = useQuery({
        queryKey: ['departments'],
        queryFn: () => departmentApi.findAll(),
        select: (res) => res.data.result,
    })
    return {
        departments: data,
        isLoading: isFetching || isLoading,
    }
}

export const useDepartmentById = (id: string) => {
    return useQuery({
        queryKey: ['departments', 'id', id],
        queryFn: () => {
            if (!id) {
                return undefined
            }
            return departmentApi.findOne(id)
        },
        select: (res) => res?.data.result,
        enabled: !!id,
    })
}

export const useUpdateDepartment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: TUpdateDepartmentInput
        }) => departmentApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] })
        },
    })
}

export const useDeleteDepartment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => departmentApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] })
        },
    })
}

export const useCreateDepartment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: TCreateDepartmentInput) =>
            departmentApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] })
        },
    })
}
