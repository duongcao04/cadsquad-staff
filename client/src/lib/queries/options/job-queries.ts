import { queryOptions } from '@tanstack/react-query'
import lodash from 'lodash'
import queryString from 'query-string'

import { jobApi, jobStatusApi } from '@/lib/api'
import { USER_CONFIG_KEYS } from '@/lib/utils'
import { TJobQueryInput } from '@/lib/validationSchemas'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { IJobResponse } from '@/shared/interfaces'
import { TJob } from '@/shared/types'
import { mapUser } from './user-queries'

// --- Mappers (Chuyển đổi dữ liệu) ---
export const mapJob = (item: IJobResponse): TJob => ({
    no: item.no,
    displayName: item.displayName,
    assignee: item.assignee ?? [],
    activityLog: item.activityLog ?? [],
    attachmentUrls: item.attachmentUrls ?? [],
    clientName: item.clientName ?? '',
    createdBy: item.createdBy,
    files: item.files,
    id: item.id,
    comments: item.comments ?? [],
    jobDeliveries: item.jobDeliveries ?? [],
    incomeCost:
        typeof item.incomeCost === 'number'
            ? item.incomeCost
            : parseInt(item.incomeCost),
    staffCost:
        typeof item.staffCost === 'number'
            ? item.staffCost
            : parseInt(item.staffCost),
    isPaid: Boolean(item.isPaid),
    isPinned: Boolean(item.isPinned),
    isPublished: Boolean(item.isPublished),
    paymentChannel: item.paymentChannel,
    priority: item.priority,
    status: item.status,
    thumbnailUrl: item.thumbnailUrl,
    description: item.description,
    paidAt: item.paidAt,
    type: item.type,
    updatedAt: new Date(item.updatedAt),
    finishedAt: item.finishedAt ? new Date(item.finishedAt) : null,
    createdAt: new Date(item.createdAt),
    dueAt: new Date(item.dueAt),
    completedAt: item.completedAt ? new Date(item.completedAt) : null,
    deletedAt: item.deletedAt ? new Date(item.deletedAt) : null,
    startedAt: new Date(item.startedAt),
})

// --- Query Options ---

// 1. Danh sách Jobs
export const jobsListOptions = (
    params: TJobQueryInput = {
        hideFinishItems: '0',
        page: 1,
        limit: 10,
        tab: ProjectCenterTabEnum.ACTIVE,
        isAll: '0',
        sort: ['displayName:asc'],
    }
) => {
    const { hideFinishItems, page, limit, search, tab, sort, ...filters } =
        params

    return queryOptions({
        queryKey: [
            'jobs',
            `tab=${tab}`,
            `limit=${limit}`,
            `page=${page}`,
            `keywords=${search}`,
            `isHideFinishItems=${hideFinishItems}`,
            `sort=${sort}`,
            `filters=${queryString.stringify(filters)}`,
        ],
        queryFn: () => {
            const newParams = lodash.omitBy(params, lodash.isUndefined)
            return jobApi.findAll(newParams)
        },
        // ✅ Select & Map data ngay tại đây
        select: (res) => ({
            jobs: Array.isArray(res.result?.data)
                ? res.result.data.map(mapJob)
                : [],
            paginate: res.result?.paginate,
        }),
    })
}


// 1. Danh sách Jobs
export const workbenchDataOptions = (
    params: Omit<TJobQueryInput, 'tab' | 'isAll' | 'hideFinishItems'> = {
        page: 1,
        limit: 10,
        sort: ['displayName:asc'],
    }
) => {
    const { page, limit, search, sort, ...filters } =
        params

    return queryOptions({
        queryKey: [
            'workbench-data',
            `limit=${limit}`,
            `page=${page}`,
            `keywords=${search}`,
            `sort=${sort}`,
            `filters=${queryString.stringify(filters)}`,
        ],
        queryFn: () => {
            const newParams = lodash.omitBy(params, lodash.isUndefined)
            return jobApi.workbenchData({
                ...newParams,
                hideFinishItems: '1'
            })
        },
        // ✅ Select & Map data ngay tại đây
        select: (res) => ({
            jobs: Array.isArray(res.result?.data)
                ? res.result.data.map(mapJob)
                : [],
            paginate: res.result?.paginate,
        }),
    })
}


// 2. Tìm kiếm Jobs
export const jobsSearchOptions = (keywords?: string) =>
    queryOptions({
        queryKey: ['jobs', 'search', keywords],
        queryFn: () => {
            if (!keywords) return null
            return jobApi.searchJobs(keywords)
        },
        enabled: !!keywords,
        select: (res) => res?.result,
    })

export const jobDeliveriesListOptions = (jobId: string) =>
    queryOptions({
        queryKey: ['jobs', 'deliveries', jobId],
        queryFn: () => jobApi.jobDeliveries(jobId),
        select: (res) => res?.result ?? [],
    })

export const jobsPendingDeliverOptions = () =>
    queryOptions({
        queryKey: ['jobs', 'pending-deliver'],
        queryFn: () => jobApi.pendingDeliver(),
        select: (res) => res?.result,
    })

export const jobsPendingPayoutsOptions = () =>
    queryOptions({
        queryKey: ['jobs', 'pending-payouts'],
        queryFn: () => jobApi.pendingPayouts(),
        select: (res) => res?.result ?? [],
    })
export const jobScheduleOptions = (month: number, year: number) =>
    queryOptions({
        queryKey: ['jobs', 'schedule', `${month}/${year}`],
        queryFn: () => jobApi.jobsDueInMonth(month, year),
        select: (res) => res?.result ?? [],
    })

// 3. Jobs theo Deadline
export const jobsDueOnDateOptions = (isoDate: string) =>
    queryOptions({
        queryKey: ['jobs', 'due-on', isoDate],
        queryFn: () => jobApi.getJobsDueOnDate(isoDate),
        enabled: !!isoDate,
        select: (res) => {
            return Array.isArray(res.result)
                ? res.result.map(mapJob)
                : []
        },
    })

// 4. Job Columns Config
export const jobColumnsOptions = () =>
    queryOptions({
        queryKey: ['configs', 'code', USER_CONFIG_KEYS.jobShowColumns],
        queryFn: () => jobApi.columns(),
        select: (res) => res?.result ?? [],
    })

// 6. Count Jobs By Tab
export const countJobByTabOptions = (tab: ProjectCenterTabEnum) =>
    queryOptions({
        queryKey: ['jobs', 'count', tab ?? 'active'],
        queryFn: () => jobApi.countTab(tab),
        select: (res) => res?.result,
    })

// 7. Job By No (Chi tiết theo mã)
export const jobByNoOptions = (jobNo: string) =>
    queryOptions({
        queryKey: ['jobs', 'no', jobNo],
        queryFn: () => jobApi.findByJobNo(jobNo),
        enabled: !!jobNo,
        select: (res) => {
            const jobData = res?.result
            return lodash.isEmpty(jobData) ? undefined : mapJob(jobData)
        },
    })

// 8. Job Assignees
export const jobAssigneesOptions = (jobId: string) =>
    queryOptions({
        queryKey: ['jobs', 'assignees', 'id', jobId],
        queryFn: () => jobApi.getAssignees(jobId),
        enabled: !!jobId,
        select: (res) => ({
            assignees: Array.isArray(res?.result?.assignees)
                ? res.result.assignees.map(mapUser)
                : [],
            totalAssignees: res?.result?.totalAssignees ?? 0,
        }),
    })

// 9. Jobs By Status Code
export const jobsByStatusCodeOptions = (statusCode?: string) =>
    queryOptions({
        queryKey: ['jobs', 'status', 'code', statusCode],
        queryFn: () =>
            statusCode ? jobStatusApi.findJobsByStatusCode(statusCode) : null,
        enabled: !!statusCode,
        select: (res) => res?.result,
    })

// 10. Job Detail (Chi tiết theo ID)
export const jobDetailOptions = (id?: string) =>
    queryOptions({
        queryKey: ['jobs', 'id', id],
        queryFn: () => (id ? jobApi.findOne(id) : null),
        enabled: !!id,
        select: (res) => res?.result,
    })

// 11. Activity Logs
export const jobActivityLogsOptions = (jobId: string) =>
    queryOptions({
        queryKey: jobId ? ['job-activity-log', 'id', jobId] : ['jobActivityLog'],
        queryFn: () => jobApi.getJobActivityLog(jobId),
        select: (res) => {
            const logs = res?.result
            return lodash.isEmpty(logs) ? [] : logs
        },
    })
