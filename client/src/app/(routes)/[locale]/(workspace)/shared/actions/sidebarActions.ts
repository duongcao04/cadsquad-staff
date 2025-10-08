import {
    IconWorkbench,
    IconWorkbenchOutline,
} from '@/shared/components/icons/sidebar-icons/IconWorkbench'
import {
    IconOnboard,
    IconOnboardOutline,
} from '@/shared/components/icons/sidebar-icons/IconOnboard'
import { SVGProps } from 'react'
// import {
//     IconDocuments,
//     IconDocumentsOutline,
// } from '@/shared/components/icons/sidebar-icons/IconDocuments'
// import {
//     IconProjectCenter,
//     IconProjectCenterOutline,
// } from '@/shared/components/icons/sidebar-icons/IconProjectCenter'
// import {
//     IconTeam,
//     IconTeamOutline,
// } from '@/shared/components/icons/sidebar-icons/IconTeam'

export type SidebarItem = {
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement
    iconFill: (props: SVGProps<SVGSVGElement>) => React.ReactElement
    titleKey: string
    path: string
}
export const sidebarActions: SidebarItem[] = [
    {
        icon: IconWorkbenchOutline,
        iconFill: IconWorkbench,
        titleKey: 'workbench',
        path: '/',
    },
    // { icon: Grip, title: 'Overview', path: '/' },
    {
        icon: IconOnboardOutline,
        iconFill: IconOnboard,
        titleKey: 'projectCenter',
        path: '/project-center',
    },
    // {
    //     icon: IconDocumentsOutline,
    //     iconFill: IconDocuments,
    //     title: 'Documents',
    //     path: '/documents',
    // },
    // {
    //     icon: IconProjectCenterOutline,
    //     iconFill: IconProjectCenter,
    //     title: 'Project Center',
    //     path: '/projects-center',
    // },
    // {
    //     icon: IconTeamOutline,
    //     iconFill: IconTeam,
    //     title: 'Team',
    //     path: '/team',
    // },
]
