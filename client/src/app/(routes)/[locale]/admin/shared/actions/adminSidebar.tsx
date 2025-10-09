import {
    LucideProps,
    CircleDollarSign,
    BriefcaseBusiness,
    UsersRound,
    MonitorCog,
} from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

type ChildrenItem = {
    id: number | string
    titleKey: string
    href: string
    target?: '_blank' | '_parent' | '_self' | '_top'
    icon: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>
}
type GroupItem = {
    id: number | string
    groupTitleKey: string
    descriptionKey?: string
    children: ChildrenItem[]
}
export type AdminSidebarActions = GroupItem[]
export const ADMIN_SIDEBAR: AdminSidebarActions = [
    {
        id: 1,
        groupTitleKey: 'system',
        children: [
            {
                id: 1.1,
                titleKey: 'systemConfiguration',
                href: '/system',
                icon: MonitorCog,
            },
        ],
    },
    {
        id: 2,
        groupTitleKey: 'websiteManagement',
        children: [
            {
                id: 2.1,
                titleKey: 'team',
                icon: UsersRound,
                href: '/admin/mgmt/team',
            },
            {
                id: 2.2,
                titleKey: 'job',
                icon: BriefcaseBusiness,
                href: '/admin/mgmt/job',
            },
            {
                id: 2.3,
                titleKey: 'payment',
                icon: CircleDollarSign,
                href: '/admin/mgmt/payment',
            },
        ],
    },
]
