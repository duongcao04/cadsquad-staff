import { Store } from '@tanstack/store'

// 1. Tạo object hằng số (Runtime)
export const ESidebarStatus = {
    EXPAND: 'expand',
    COLLAPSE: 'collapse',
} as const
// 2. Tạo Type từ Object đó (để dùng cho biến/props)
export type ESidebarStatus =
    (typeof ESidebarStatus)[keyof typeof ESidebarStatus]

export type SidebarStatus = 'expand' | 'collapse'

type AppState = {
    sidebarStatus: SidebarStatus
}

// 1. Create the Store with initial state
export const appStore = new Store<AppState>({
    sidebarStatus: ESidebarStatus.EXPAND,
})

// 2. Define Actions
// TanStack Store actions are just functions that call store.setState

export const setSidebarStatus = (status: SidebarStatus) => {
    appStore.setState((state) => ({
        ...state,
        sidebarStatus: status,
    }))
}

export const toggleSidebar = () => {
    appStore.setState((state) => ({
        ...state,
        sidebarStatus:
            state.sidebarStatus === ESidebarStatus.EXPAND
                ? ESidebarStatus.COLLAPSE
                : ESidebarStatus.EXPAND,
    }))
}
