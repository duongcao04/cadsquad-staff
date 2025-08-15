import {
    IconWorkbench,
    IconWorkbenchOutline,
} from '@/shared/components/icons/sidebar-icons/IconWorkbench'
import {
    IconOnboard,
    IconOnboardOutline,
} from '@/shared/components/icons/sidebar-icons/IconOnboard'
import {
    IconDocuments,
    IconDocumentsOutline,
} from '@/shared/components/icons/sidebar-icons/IconDocuments'
import {
    IconProjectCenter,
    IconProjectCenterOutline,
} from '@/shared/components/icons/sidebar-icons/IconProjectCenter'
import {
    IconTeam,
    IconTeamOutline,
} from '@/shared/components/icons/sidebar-icons/IconTeam'

export const FILE = {
    SPLASH: encodeURIComponent('/'),
}

export const MS = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
}

export const appSidebar = [
    {
        icon: IconWorkbenchOutline,
        iconFill: IconWorkbench,
        title: 'Workbench',
        path: '/',
    },
    // { icon: Grip, title: 'Overview', path: '/' },
    {
        icon: IconOnboardOutline,
        iconFill: IconOnboard,
        title: 'Onboarding',
        path: '/onboarding',
    },
    {
        icon: IconDocumentsOutline,
        iconFill: IconDocuments,
        title: 'Documents',
        path: '/documents',
    },
    {
        icon: IconProjectCenterOutline,
        iconFill: IconProjectCenter,
        title: 'Project Center',
        path: '/projects-center',
    },
    {
        icon: IconTeamOutline,
        iconFill: IconTeam,
        title: 'Team',
        path: '/team',
    },
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
