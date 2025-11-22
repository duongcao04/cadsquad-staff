import { jobTitleApi } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    TCreateJobTitleInput,
    TUpdateJobTitleInput,
} from '../validationSchemas'

export const useJobTitles = () => {
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['job-titles'],
        queryFn: () => jobTitleApi.findAll(),
        select: (res) => res.data.result,
    })
    return {
        jobTitles: data,
        isLoading: isLoading || isFetching,
    }
}

export const useJobTitleById = (id: string) =>
    useQuery({
        queryKey: ['job-titles', id],
        queryFn: () => {
            if (!id) {
                return undefined
            }
            return jobTitleApi.findOne(id)
        },
        select: (res) => res?.data.result,
        enabled: !!id,
    })

export const useCreateJobTitle = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: TCreateJobTitleInput) => jobTitleApi.create(data),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['job-titles'] }),
    })
}

export const useUpdateJobTitle = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: TUpdateJobTitleInput
        }) => jobTitleApi.update(id, data),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['job-titles'] }),
    })
}

export const useDeleteJobTitle = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => jobTitleApi.remove(id),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['job-titles'] }),
    })
}
