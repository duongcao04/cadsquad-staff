import { queryOptions } from '@tanstack/react-query'
import { IUserResponse } from '../../../shared/interfaces'
import { TUser } from '../../../shared/types'
import { authApi, IProfileOverview, userApi } from '../../api'
import { IMAGES, toDate, toNullableDate } from '../../utils'
import { mapDepartment } from './department-queries'
import { mapJobTitle } from './job-title-queries'

export const mapUser: (item?: IUserResponse) => TUser = (item) => {
    return {
        id: item?.id ?? 'N/A',
        displayName: item?.displayName ?? 'Unknown User',
        avatar: item?.avatar ?? IMAGES.emptyAvatar,
        email: item?.email ?? 'unknown@cadsquad.vn',
        username: item?.username ?? 'unknown',
        phoneNumber: item?.phoneNumber ?? 'Unknown phone number',
        department: mapDepartment(item?.department ?? undefined) ?? null,
        jobTitle: mapJobTitle(item?.jobTitle ?? undefined) ?? null,
        isActive: Boolean(item?.isActive),
        role: item?.role ?? 'USER',
        files: item?.files ?? [],
        accounts: item?.accounts ?? [],
        notifications: item?.notifications ?? [],
        configs: item?.configs ?? [],
        filesCreated: item?.filesCreated ?? [],
        jobActivityLog: item?.jobActivityLog ?? [],
        jobsCreated: item?.jobsCreated ?? [],
        sendedNotifications: item?.sendedNotifications ?? [],
        lastLoginAt: toNullableDate(item?.lastLoginAt),
        createdAt: toDate(item?.createdAt),
        updatedAt: toDate(item?.updatedAt),
    }
}

export const usersListOptions = () => {
    return queryOptions({
        queryKey: ['users'],
        queryFn: () => userApi.findAll(),
        select: (res) => {
            const userData = res?.result?.users
            return {
                users: Array.isArray(userData) ? userData.map(mapUser) : [],
                total: res.result?.total ?? 0,
            }
        },
    })
}

export const userOptions = (username: string) => {
    return queryOptions({
        queryKey: ['users', 'username', username],
        queryFn: () => userApi.findOne(username),
        select: (res) => {
            const userData = res?.result
            return mapUser(userData)
        },
    })
}
export const profileOptions = () => {
    return queryOptions({
        queryKey: ['profile'],
        queryFn: () => authApi.getProfile(),
        select: (res) => {
            const userData = res?.data.result
            return mapUser(userData)
        },
    })
}
export const profileOverviewOptions = () => {
    return queryOptions({
        queryKey: ['profile', 'overview'],
        queryFn: () => userApi.overview(),
        select: (res) => {
            console.log(res.result)

            const data: IProfileOverview = {
                summary: {
                    activeJobs: res.result?.summary.activeJobs ?? 0,
                    earningsTrend: res.result?.summary.earningsTrend ?? 0,
                    hoursLogged: res.result?.summary.hoursLogged ?? 0,
                    jobsCompleted: res.result?.summary.jobsCompleted ?? 0,
                    totalEarnings: res.result?.summary.totalEarnings ?? 0,
                },
                charts: {
                    financial: res.result?.charts.financial ?? '',
                    jobStatus: res.result?.charts.jobStatus ?? '',
                },
            }
            return data
        },
    })
}
export const checkUsernameTakenOptions = (username: string) => {
    return queryOptions({
        queryKey: ['users', 'username', 'taken', username],
        queryFn: () => userApi.checkUsernameTaken(username),
        select: (res) => {
            return { isTaken: res.result?.isExist }
        },
    })
}
