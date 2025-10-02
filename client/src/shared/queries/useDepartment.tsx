import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { departmentApi } from '@/app/api/department.api'
import {
    CreateDepartmentInput,
    UpdateDepartmentInput,
} from '@/shared/validationSchemas/department.schema'

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
            data: UpdateDepartmentInput
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
        mutationFn: (data: CreateDepartmentInput) => departmentApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] })
        },
    })
}
