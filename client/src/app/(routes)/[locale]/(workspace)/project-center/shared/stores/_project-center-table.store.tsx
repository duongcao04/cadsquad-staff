import { Store } from '@tanstack/react-store'

export const pCenterTableStore = new Store<{
    selectedKeys: Set<string> | 'all'
    newJobNo: string | null
}>({
    selectedKeys: new Set(),
    newJobNo: null,
})
