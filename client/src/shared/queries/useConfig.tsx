'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { configApi } from '@/app/api/config.api'
import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { CreateConfigInput, UpdateConfigInput } from '@/shared/validationSchemas/config.schema'

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
	return useQuery({
		queryKey: ['configs', 'code', code],
		queryFn: () => configApi.findByCode(code),
		enabled: !!code,
		select: (res) => res.data.result,
	})
}

export const useCreateConfigMutation = () => {
	return useMutation({
		mutationKey: ['createConfig'],
		mutationFn: (data: CreateConfigInput) => configApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['configs'] })
		},
	})
}

export const useUpdateConfigByCodeMutation = () => {
	return useMutation({
		mutationKey: ['updateConfig'],
		mutationFn: ({ code, data }: { code: string; data: UpdateConfigInput }) => configApi.updateByCode(code, data),
		onSuccess: (_, { code }) => {
			queryClient.invalidateQueries({ queryKey: ['configs'] })
			queryClient.invalidateQueries({ queryKey: ['configs', 'code', code] })
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
