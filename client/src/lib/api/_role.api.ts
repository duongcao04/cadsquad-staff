import { type ApiResponse, axiosClient } from '@/lib/axios'
import {
    TGroupPermission,
    TPermission,
    TRole,
} from '../../shared/types/_role.type'

export const roleApi = {
    findAll: async () => {
        return axiosClient
            .get<
                ApiResponse<{
                    roles: TRole[]
                    total: number
                }>
            >(`/v1/roles`)
            .then((res) => res.data)
    },
    findAllPermission: async () => {
        return axiosClient
            .get<
                ApiResponse<{
                    permissions: TPermission[]
                    total: number
                }>
            >(`/v1/roles/permissions`)
            .then((res) => res.data)
    },
    findAllPermissionGrouped: async () => {
        return axiosClient
            .get<
                ApiResponse<{ groups: TGroupPermission[] }>
            >(`/v1/roles/permissions/grouped`)
            .then((res) => res.data)
    },
}
