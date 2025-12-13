'use client'

import { departmentApi } from '@/lib/api'
import {
    TCreateDepartmentInput,
    TUpdateDepartmentInput,
} from '@/lib/validationSchemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IDepartmentResponse } from '../../shared/interfaces'
import { TDepartment } from '../../shared/types'
import { useMemo } from 'react'

export const mapDepartment: (item: IDepartmentResponse) => TDepartment = (
    item
) => ({
    id: item.id ?? '',
    code: item.code ?? '',
    users: item.users ?? [],
    hexColor: item.hexColor ?? '#ffffff',
    notes: item.notes ?? '',
    displayName: item.displayName ?? '',
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
})

export const useDepartments = () => {
    const { data, isFetching, isLoading } = useQuery({
        queryKey: ['departments'],
        queryFn: () => departmentApi.findAll(),
        select: (res) => res.data.result,
    })

    const departments = useMemo(() => {
        const departmentsData = data

        if (!Array.isArray(departmentsData)) {
            return []
        }

        return departmentsData.map((item) => mapDepartment(item))
    }, [data])

    return {
        departments: departments ?? [],
        data: departments ?? [],
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
