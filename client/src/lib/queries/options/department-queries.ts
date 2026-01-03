import { queryOptions } from '@tanstack/react-query'
import { IDepartmentResponse } from '../../../shared/interfaces'
import { TDepartment } from '../../../shared/types'
import { departmentApi } from '../../api'
import { COLORS, toDate } from '../../utils'

export const mapDepartment: (item?: IDepartmentResponse) => TDepartment = (
    item
) => ({
    id: item?.id ?? 'N/A',
    code: item?.code ?? 'UNKNOWN',
    displayName: item?.displayName ?? 'Unknown department',
    users: item?.users ?? [],
    hexColor: item?.hexColor ?? COLORS.white,
    notes: item?.notes ?? null,
    createdAt: toDate(item?.createdAt),
    updatedAt: toDate(item?.updatedAt),
})

export const departmentsListOptions = () => {
    return queryOptions({
        queryKey: ['departments'],
        queryFn: () => departmentApi.findAll(),
        select: (res) => {
            const departmentsData = res?.result
            return {
                departments: Array.isArray(departmentsData)
                    ? departmentsData.map(mapDepartment)
                    : [],
            }
        },
    })
}

export const departmentOptions = (identify: string) => {
    return queryOptions({
        queryKey: ['departments', 'identify', identify],
        queryFn: () => departmentApi.findOne(identify),
        select: (res) => {
            const departmentData = res?.result
            return mapDepartment(departmentData)
        },
    })
}
