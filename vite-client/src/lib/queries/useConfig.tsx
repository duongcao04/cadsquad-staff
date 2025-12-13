import { useMutation, useQuery } from '@tanstack/react-query'

import {
    type TCreateUserConfigInput,
    type TUpdateUserConfigInput,
} from '@/lib//validationSchemas'
import { configApi } from '@/lib/api'

import { queryClient } from '../../main'

export const useConfigs = () => {
    return useQuery({
        queryKey: ['configs'],
        queryFn: () => configApi.findAll(),
        select: (res) => res.data.result,
    })
}

export const useConfigById = (id: string) => {
    return useQuery({
        queryKey: ['configs', id],
        queryFn: () => configApi.findById(id),
        enabled: !!id,
        select: (res) => res.data.result,
    })
}

export const useConfigByCode = (code: string) => {
    const { data } = useQuery({
        queryKey: ['configs', 'code', code],
        queryFn: () => configApi.findByCode(code),
        enabled: !!code,
        select: (res) => res.data.result,
    })
    return {
        data,
        value: data?.value,
    }
}

export const useCreateConfigMutation = () => {
    return useMutation({
        mutationKey: ['createConfig'],
        mutationFn: (data: TCreateUserConfigInput) => configApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['configs'] })
        },
    })
}

export const useUpdateConfigByCodeMutation = () => {
    return useMutation({
        mutationKey: ['updateConfig'],
        mutationFn: ({
            code,
            data,
        }: {
            code: string
            data: TUpdateUserConfigInput
        }) => configApi.updateByCode(code, data),
        onSuccess: (_, { code }) => {
            queryClient.invalidateQueries({
                queryKey: ['configs', 'code', code],
            })
        },
    })
}

export const useDeleteConfigMutation = () => {
    return useMutation({
        mutationKey: ['deleteConfig'],
        mutationFn: (id: string) => configApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['configs'] })
        },
    })
}
