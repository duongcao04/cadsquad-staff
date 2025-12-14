import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from '@heroui/react'
import { Link } from '@tanstack/react-router'
import {
    BellIcon,
    BriefcaseBusiness,
    CircleDollarSign,
    type LucideIcon,
    MonitorCog,
    Newspaper,
    Palette,
    SquareUserRound,
    Users,
} from 'lucide-react'

import { useProfile } from '@/lib/queries'
import { SettingsGearIcon } from '@/shared/components'

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

// eslint-disable-next-line react-refresh/only-export-components
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

// eslint-disable-next-line react-refresh/only-export-components
export const USER_SETTINGS_DROPDOWN: GroupItem[] = [
    {
        ...ADMIN_SETTINGS_DROPDOWN[0],
    },
]

export function SettingsDropdown() {
    const { isAdmin } = useProfile()

    const dropdownActions = isAdmin
        ? ADMIN_SETTINGS_DROPDOWN
        : USER_SETTINGS_DROPDOWN

    return (
        <Dropdown
            placement="bottom-end"
            showArrow
            classNames={{
                content: 'rounded-lg',
            }}
        >
            <DropdownTrigger>
                <Button
                    variant="light"
                    startContent={<SettingsGearIcon size={18} />}
                    size="sm"
                    isIconOnly
                />
            </DropdownTrigger>
            <DropdownMenu
                aria-label="User notification"
                disabledKeys={[
                    'title',
                    'system',
                    'job',
                    'payment',
                    'articles',
                    'notificationSettings',
                ]}
                classNames={{
                    base: 'w-[520px] overflow-y-auto left-0',
                }}
            >
                {dropdownActions.map((group) => {
                    return (
                        <DropdownSection
                            key={group.groupTitleKey}
                            title={group.groupTitleKey}
                        >
                            {group.children.map((item) => {
                                return (
                                    <DropdownItem
                                        key={item.titleKey}
                                        startContent={
                                            <div className="size-8 grid place-items-center">
                                                {item.icon && (
                                                    <item.icon
                                                        size={24}
                                                        className="text-text-7"
                                                    />
                                                )}
                                            </div>
                                        }
                                    >
                                        <Link
                                            to={item.href}
                                            className="block size-full"
                                        >
                                            <p className="font-medium text-text-7">
                                                {item.titleKey}
                                            </p>
                                            <p className="text-xs text-text-subdued">
                                                {item.descriptionKey}
                                            </p>
                                        </Link>
                                    </DropdownItem>
                                )
                            })}
                        </DropdownSection>
                    )
                })}
            </DropdownMenu>
        </Dropdown>
    )
}
