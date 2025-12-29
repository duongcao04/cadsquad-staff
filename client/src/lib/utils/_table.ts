import { JobColumnKey } from '@/shared/types'
import { RoleEnum } from '../../shared/enums'

export const JOB_COLUMNS: {
    displayName: string
    uid: JobColumnKey
    sortable: boolean
    description?: string
    allowedRoles?: string[] // For permission handling
}[] = [
    {
        displayName: 'Thumbnail',
        uid: 'thumbnailUrl',
        sortable: false,
    },
    {
        displayName: 'Client',
        uid: 'clientName',
        sortable: false,
    },
    {
        displayName: 'Job type',
        uid: 'type',
        sortable: true,
    },
    {
        displayName: 'Job no',
        uid: 'no',
        sortable: true,
    },
    {
        displayName: 'Job name',
        uid: 'displayName',
        sortable: true,
    },
    {
        displayName: 'Income',
        uid: 'incomeCost',
        sortable: true,
        allowedRoles: ['ADMIN', 'ACCOUNTING'], // Restricted
        description: 'Total revenue (Admin/Accounting only).',
    },
    {
        displayName: 'Total Staff Cost',
        uid: 'totalStaffCost',
        sortable: true,
        allowedRoles: ['ADMIN', 'ACCOUNTING'], // Restricted
        description: 'Sum of all staff costs for this job.',
    },
    {
        displayName: 'Staff Cost',
        uid: 'staffCost',
        sortable: true,
        allowedRoles: ['USER'], // Restricted
        description: 'The specific cost allocated to you for this job.',
    },
    {
        displayName: 'Status',
        uid: 'status',
        sortable: false,
    },
    {
        displayName: 'Due on',
        uid: 'dueAt',
        sortable: true,
    },
    {
        displayName: 'Assignee',
        uid: 'assignments',
        sortable: false,
    },
    {
        displayName: 'Payment',
        uid: 'isPaid',
        sortable: true,
    },
    {
        displayName: 'Actions',
        uid: 'action',
        sortable: false,
    },
]
/**
 * Filters the master column list based on user permissions.
 * @param role - The role of the logged-in user
 * @param visibleColumns - State from your store ('all' or array of UIDs)
 */
export const getAllowedJobColumns = (
    role: RoleEnum | string | undefined,
    visibleColumns: 'all' | JobColumnKey[] = 'all'
) => {
    // 1. First, filter by Role permissions (allowedRoles property)
    const allowedByRole = JOB_COLUMNS.filter((column) => {
        // Public columns (no roles defined)
        if (!column.allowedRoles || column.allowedRoles.length === 0)
            return true

        // Restricted columns
        return role ? column.allowedRoles.includes(role) : false
    })

    // 2. Then, filter by User Toggle Preferences (visibleColumns)
    if (visibleColumns === 'all') return allowedByRole

    return allowedByRole.filter((column) => visibleColumns.includes(column.uid))
}
