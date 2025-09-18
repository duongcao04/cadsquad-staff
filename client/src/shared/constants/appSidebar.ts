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

export const appSidebar = [
    {
        icon: IconWorkbenchOutline,
        iconFill: IconWorkbench,
        title: 'Workbench',
        viTitle: 'Bàn làm việc',
        path: '/',
    },
    // { icon: Grip, title: 'Overview', path: '/' },
    {
        icon: IconOnboardOutline,
        iconFill: IconOnboard,
        title: 'Onboarding',
        viTitle: 'Đang triển khai',
        path: '/onboarding',
    },
    {
        icon: IconDocumentsOutline,
        iconFill: IconDocuments,
        title: 'Documents',
        viTitle: 'Tài liệu',
        path: '/documents',
    },
    {
        icon: IconProjectCenterOutline,
        iconFill: IconProjectCenter,
        title: 'Project Center',
        viTitle: 'Trung tâm dự án',
        path: '/projects-center',
    },
    {
        icon: IconTeamOutline,
        iconFill: IconTeam,
        title: 'Team',
        viTitle: 'Nhóm',
        path: '/team',
    },
]
export type SidebarItem = (typeof appSidebar)[0]
