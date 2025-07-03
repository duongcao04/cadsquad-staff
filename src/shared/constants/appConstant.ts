import {
    FolderOpen,
    LayoutDashboard,
    PackageOpen,
    Target,
    UsersRound,
} from 'lucide-react'

export const appSidebar = [
    { icon: LayoutDashboard, title: 'Dashboard', path: '/' },
    { icon: Target, title: 'Onboarding', path: '/onboarding' },
    { icon: FolderOpen, title: 'Documents', path: '/documents' },
    { icon: PackageOpen, title: 'Project Center', path: '/projects' },
    { icon: UsersRound, title: 'Team', path: '/team' },
]
export type SidebarItem = (typeof appSidebar)[0]

export const projectStatuses: {
    status: ProjectStatus
    color: string
    icon: string
}[] = [
    {
        status: 'onProgress',
        color: '#ffff00',
        icon: '',
    },
    {
        status: 'revision',
        color: '#f2aa84',
        icon: '',
    },
    {
        status: 'delivered',
        color: '#a02b93',
        icon: '',
    },
]
export type ProjectStatus = 'onProgress' | 'revision' | 'delivered'
