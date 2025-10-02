import { jobTitleApi } from '@/app/api/job-title.api'
import {
    CreateJobTitleInput,
    UpdateJobTitleInput,
} from '@/shared/validationSchemas/job-title.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
        mutationFn: (data: CreateJobTitleInput) => jobTitleApi.create(data),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['job-titles'] }),
    })
}

export const useUpdateJobTitle = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateJobTitleInput }) =>
            jobTitleApi.update(id, data),
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
