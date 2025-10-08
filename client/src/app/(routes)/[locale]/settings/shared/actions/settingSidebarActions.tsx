import {
    BellIcon,
    CircleUserRound,
    LucideProps,
    Palette,
    Earth,
    ShieldPlus,
    SquareUserRound,
    MonitorCog,
    UsersRound,
    BriefcaseBusiness,
    CircleDollarSign,
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
export type SidebarActions = GroupItem[]
export const PERSONAL_SETTING_SIDEBAR: GroupItem[] = [
    {
        id: 1,
        groupTitleKey: 'accountSettings',
        children: [
            {
                id: 1.1,
                titleKey: 'generalInformation',
                href: '/profile',
                target: '_blank',
                icon: SquareUserRound,
            },
            {
                id: 1.2,
                titleKey: 'personalDetails',
                href: '/settings/personal_details',
                icon: CircleUserRound,
            },
            {
                id: 1.3,
                titleKey: 'passwordAndSecurity',
                href: '/settings/password_and_security',
                icon: ShieldPlus,
            },
        ],
    },
    {
        id: 2,
        groupTitleKey: 'appearance',
        children: [
            {
                id: 2.1,
                titleKey: 'appearance',
                icon: Palette,
                href: '/settings/appearance',
            },
            {
                id: 2.2,
                titleKey: 'languageAndRegion',
                icon: Earth,
                href: '/settings/language_and_region',
            },
        ],
    },
    {
        id: 3,
        groupTitleKey: 'notifications',
        children: [
            {
                id: 3.1,
                titleKey: 'notificationSettings',
                icon: BellIcon,
                href: '/settings/notifications',
            },
        ],
    },
]

export const ADMIN_SETTING_SIDEBAR: GroupItem[] = [
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
                href: '/settings/admin/manage/team',
            },
            {
                id: 2.2,
                titleKey: 'job',
                icon: BriefcaseBusiness,
                href: '/settings/admin/manage/job',
            },
            {
                id: 2.3,
                titleKey: 'payment',
                icon: CircleDollarSign,
                href: '/settings/admin/manage/payment',
            },
        ],
    },
]
