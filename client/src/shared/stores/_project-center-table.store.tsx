import { Store } from '@tanstack/react-store'
import type { JobColumnKey, TJob } from '../types'
import { STORAGE_KEYS } from '../../lib'
import { RoleEnum } from '../enums'
import { getAllowedJobColumns } from '../../lib/utils'

const DEFAULT_COLUMNS: JobColumnKey[] = [
    'no',
    'displayName',
    'staffCost',
    'status',
    'dueAt',
    'assignments',
    'isPaid',
    'action',
]

const getInitJobColumns = (): JobColumnKey[] | 'all' => {
    if (typeof window === 'undefined') return DEFAULT_COLUMNS
    const stored = localStorage.getItem(STORAGE_KEYS.jobColumns)
    if (!stored) return DEFAULT_COLUMNS

    try {
        const parsed = JSON.parse(stored)
        return Array.isArray(parsed) && parsed.length > 0
            ? (parsed as JobColumnKey[])
            : DEFAULT_COLUMNS
    } catch (e) {
        return DEFAULT_COLUMNS
    }
}

export const pCenterTableStore = new Store<{
    selectedKeys: Set<string> | 'all'
    newJobNo: string | null
    contextItem: TJob | null
    openContextMenu: boolean
    viewDetail: string | null
    jobColumns: JobColumnKey[] | 'all'
}>({
    selectedKeys: new Set(),
    newJobNo: null,
    contextItem: null,
    viewDetail: null,
    openContextMenu: false,
    jobColumns: getInitJobColumns(),
})

/**
 * Toggle Column Visibility
 * Now checks against the Role to ensure restricted columns are handled correctly
 */
export const toggleJobColumns = (
    key: JobColumnKey,
    isVisible: boolean,
    role?: RoleEnum
) => {
    pCenterTableStore.setState((prev) => {
        const currentCols = prev.jobColumns

        // Use helper to get ALL keys the user is actually allowed to see/toggle
        const allowedKeys = getAllowedJobColumns(role, 'all').map((c) => c.uid)

        let newColumns: JobColumnKey[]

        if (currentCols === 'all') {
            if (isVisible) return prev
            newColumns = allowedKeys.filter((k) => k !== key)
        } else {
            if (isVisible) {
                newColumns = currentCols.includes(key)
                    ? currentCols
                    : [...currentCols, key]
            } else {
                newColumns = currentCols.filter((k) => k !== key)
            }
        }

        // Final Sanity Check: Ensure no restricted columns leaked in
        const sanitizedColumns = newColumns.filter((k) =>
            allowedKeys.includes(k)
        )

        if (typeof window !== 'undefined') {
            localStorage.setItem(
                STORAGE_KEYS.jobColumns,
                JSON.stringify(sanitizedColumns)
            )
        }

        return { ...prev, jobColumns: sanitizedColumns }
    })
}

export const resetJobColumns = (role?: RoleEnum) => {
    // Reset to the default filtered by role
    const defaultForRole = getAllowedJobColumns(role, DEFAULT_COLUMNS).map(
        (c) => c.uid
    )

    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.jobColumns)
    }

    pCenterTableStore.setState((prev) => ({
        ...prev,
        jobColumns: defaultForRole,
    }))
}
