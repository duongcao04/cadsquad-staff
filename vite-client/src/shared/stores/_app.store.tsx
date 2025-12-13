import { Store } from '@tanstack/store'

export enum ESidebarStatus {
    EXPAND = 'expand',
    COLLAPSE = 'collapse',
}

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
