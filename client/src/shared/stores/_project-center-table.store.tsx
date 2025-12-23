import { Store } from '@tanstack/react-store'
import type { JobColumnKey, TJob } from '../types'
import { JOB_COLUMNS, STORAGE_KEYS } from '../../lib'

const getInitJobColumns = (): JobColumnKey[] | 'all' => {
    if (typeof window === 'undefined') return ['no','displayName','staffCost','status','dueAt','assignee','isPaid','action']

    const stored = localStorage.getItem(STORAGE_KEYS.jobColumns)

    if (!stored) {
        return ['no','displayName','staffCost','status','dueAt','assignee','isPaid','action']
    } else {
        return JSON.parse(stored) as JobColumnKey[]
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

// 1. Helper to get all keys dynamically from your config
const ALL_JOB_COLUMN_KEYS = JOB_COLUMNS.map((col) => col.uid)

export const toggleJobColumns = (key: JobColumnKey, isVisible: boolean) => {
    pCenterTableStore.setState((prev) => {
        const currentCols = prev.jobColumns
        let newColumns: JobColumnKey[]

        // CASE A: Current state is 'all'
        if (currentCols === 'all') {
            if (isVisible) {
                // If we are showing 'all', and ask to show one, nothing changes
                return prev
            } else {
                // If hiding one while in 'all' mode:
                // We take ALL keys and filter out the one we want to hide
                newColumns = ALL_JOB_COLUMN_KEYS.filter((k) => k !== key)
            }
        }
        // CASE B: Current state is a custom array
        else {
            if (isVisible) {
                // Add key if not present
                newColumns = currentCols.includes(key)
                    ? currentCols
                    : [...currentCols, key]
            } else {
                // Remove key
                newColumns = currentCols.filter((k) => k !== key)
            }
        }

        // Persist to LocalStorage
        // Note: You might want to remove the item if newColumns.length === ALL_JOB_COLUMN_KEYS.length
        // to revert to 'all' state, but saving the specific array is safer for consistency.
        localStorage.setItem(
            STORAGE_KEYS.jobColumns,
            JSON.stringify(newColumns)
        )

        return {
            ...prev,
            jobColumns: newColumns,
        }
    })
}
