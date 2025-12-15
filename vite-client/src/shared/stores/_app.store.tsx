import { Store } from '@tanstack/store'
import { STORAGE_KEYS } from '../../lib'

// 1. Tạo object hằng số (Runtime)
export const ESidebarStatus = {
    EXPAND: 'expand',
    COLLAPSE: 'collapse',
} as const

// 2. Tạo Type từ Object đó (để dùng cho biến/props)
export type ESidebarStatus =
    (typeof ESidebarStatus)[keyof typeof ESidebarStatus]

export type SidebarStatus = 'expand' | 'collapse'

const getInitialSidebarStatus = (): SidebarStatus => {
    if (typeof window === 'undefined') return ESidebarStatus.EXPAND

    const stored = localStorage.getItem(STORAGE_KEYS.sidebarStatus)

    if (
        stored === ESidebarStatus.EXPAND ||
        stored === ESidebarStatus.COLLAPSE
    ) {
        return stored
    }

    return ESidebarStatus.EXPAND
}

type AppState = {
    sidebarStatus: SidebarStatus
}

// 1. Create the Store with initial state
export const appStore = new Store<AppState>({
    sidebarStatus: getInitialSidebarStatus(),
})

// 2. Define Actions
// TanStack Store actions are just functions that call store.setState

export const setSidebarStatus = (status: SidebarStatus) => {
    localStorage.setItem(STORAGE_KEYS.sidebarStatus, status)
    appStore.setState((state) => ({
        ...state,
        sidebarStatus: status,
    }))
}

export const toggleSidebar = () => {
    appStore.setState((state) => {
        const nextStatus =
            state.sidebarStatus === ESidebarStatus.EXPAND
                ? ESidebarStatus.COLLAPSE
                : ESidebarStatus.EXPAND

        localStorage.setItem(STORAGE_KEYS.sidebarStatus, nextStatus)

        return {
            ...state,
            sidebarStatus: nextStatus,
        }
    })
}
