import { type ApiResponse,axiosClient } from '@/lib/axios'
import type {
    TCreateDepartmentInput,
    TUpdateDepartmentInput,
} from '@/lib/validationSchemas'
import type { IDepartmentResponse } from '@/shared/interfaces'

export const departmentApi = {
    create: (data: TCreateDepartmentInput) => {
        return axiosClient.post<ApiResponse<IDepartmentResponse>>(
            '/v1/departments',
            data
        )
    },

    findAll: () => {
        return axiosClient.get<ApiResponse<IDepartmentResponse[]>>(
            '/v1/departments'
        )
    },

    findOne: (id: string) => {
        return axiosClient.get<ApiResponse<IDepartmentResponse>>(
            `/v1/departments/${id}`
        )
    },

    update: (id: string, data: TUpdateDepartmentInput) => {
        return axiosClient.patch<ApiResponse<{ id: string }>>(
            `/v1/departments/${id}`,
            data
        )
    },

    remove: (id: string) => {
        return axiosClient.delete(`/v1/departments/${id}`)
    },
}
