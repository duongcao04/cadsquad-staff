import { LucideIcon } from 'lucide-react'
import {
    SquareUserRound,
    Palette,
    BellIcon,
    MonitorCog,
    BriefcaseBusiness,
    CircleDollarSign,
    Users,
    Newspaper,
} from 'lucide-react'

interface ChildItem {
    id: number
    icon?: LucideIcon
    titleKey: string // i18n key
    descriptionKey: string // i18n key
    href: string
}

interface GroupItem {
    id: number
    groupTitleKey: string // i18n key
    children: ChildItem[]
}

export const ADMIN_SETTINGS_DROPDOWN: GroupItem[] = [
    {
        id: 1,
        groupTitleKey: 'personalSettings',
        children: [
            {
                id: 1.1,
                icon: SquareUserRound,
                titleKey: 'accountSettings',
                descriptionKey: 'accountSettingsDesc',
                href: '/settings/personal_details',
            },
            {
                id: 1.2,
                icon: Palette,
                titleKey: 'appearance',
                descriptionKey: 'appearanceDesc',
                href: '/settings/appearance',
            },
            {
                id: 1.3,
                icon: BellIcon,
                titleKey: 'notificationSettings',
                descriptionKey: 'notificationSettingsDesc',
                href: '/settings/notifications',
            },
        ],
    },
    {
        id: 2,
        groupTitleKey: 'adminSettings',
        children: [
            {
                id: 2.1,
                icon: MonitorCog,
                titleKey: 'system',
                descriptionKey: 'systemDesc',
                href: '/admin/system',
            },
            {
                id: 2.2,
                icon: BriefcaseBusiness,
                titleKey: 'job',
                descriptionKey: 'jobDesc',
                href: '/admin/mgmt/jobs',
            },
            {
                id: 2.3,
                icon: CircleDollarSign,
                titleKey: 'payment',
                descriptionKey: 'paymentDesc',
                href: '/admin/mgmt/payments',
            },
            {
                id: 2.4,
                icon: Users,
                titleKey: 'team',
                descriptionKey: 'teamDesc',
                href: '/admin/mgmt/team',
            },
        ],
    },
    {
        id: 3,
        groupTitleKey: 'cadsquadSettings',
        children: [
            {
                id: 3.1,
                icon: Newspaper,
                titleKey: 'articles',
                descriptionKey: 'articlesDesc',
                href: '/admin/site/cadsquad',
            },
        ],
    },
]

export const USER_SETTINGS_DROPDOWN: GroupItem[] = [
    {
        ...ADMIN_SETTINGS_DROPDOWN[0],
    },
]
