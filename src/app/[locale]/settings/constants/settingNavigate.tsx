import {
    BellIcon,
    BellPlus,
    CircleUserRound,
    LucideProps,
    Moon,
    Palette,
    Earth,
    ShieldPlus,
    SquareUserRound,
} from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

type SettingGroup = {
    id: number | string
    groupTitle?: string
    description?: string
    children: {
        id: number | string
        title: string
        href: string
        icon: ForwardRefExoticComponent<
            LucideProps & RefAttributes<SVGSVGElement>
        >
    }[]
}
export const VI_SETTING_NAVIGATE: SettingGroup[] = [
    {
        id: 1,
        groupTitle: 'Tài khoản',
        children: [
            {
                id: 1.1,
                title: 'Thông tin cá nhân',
                href: '/profile',
                icon: SquareUserRound,
            },
            {
                id: 1.1,
                title: 'Cập nhật thông tin',
                href: '/settings/account',
                icon: CircleUserRound,
            },
            {
                id: 1.2,
                title: 'Mật khẩu và bảo mật',
                href: '/settings/security',
                icon: ShieldPlus,
            },
        ],
    },
    {
        id: 2,
        groupTitle: 'Hiển thị',
        children: [
            {
                id: 2.1,
                title: 'Giao diện',
                icon: Palette,
                href: '/settings/appeare',
            },
            {
                id: 2.2,
                title: 'Ngôn ngữ và khu vực',
                icon: Earth,
                href: '/settings/language_and_region',
            },
            {
                id: 2.3,
                title: 'Chế độ tối',
                icon: Moon,
                href: '/settings/dark_mode',
            },
        ],
    },
    {
        id: 3,
        groupTitle: 'Thông báo',
        children: [
            {
                id: 3.1,
                title: 'Thông báo',
                icon: BellIcon,
                href: '/settings/notifications',
            },
            {
                id: 3.2,
                title: 'Cài đặt thông báo',
                icon: BellPlus,
                href: '/settings/setting_notifications',
            },
        ],
    },
]

export const SETTING_NAVIGATE: SettingGroup[] = [
    {
        id: 1,
        groupTitle: 'Account',
        children: [
            {
                id: 1.1,
                title: 'Personal Information',
                href: '/profile',
                icon: SquareUserRound,
            },
            {
                id: 1.2,
                title: 'Edit Information',
                href: '/settings/account',
                icon: CircleUserRound,
            },
            {
                id: 1.3,
                title: 'Password & Security',
                href: '/settings/security',
                icon: ShieldPlus,
            },
        ],
    },
    {
        id: 2,
        groupTitle: 'Display',
        children: [
            {
                id: 2.1,
                title: 'Appearance',
                icon: Palette,
                href: '/settings/appeare',
            },
            {
                id: 2.2,
                title: 'Language & Region',
                icon: Earth,
                href: '/settings/language_and_region',
            },
            {
                id: 2.3,
                title: 'Dark Mode',
                icon: Moon,
                href: '/settings/dark_mode',
            },
        ],
    },
    {
        id: 3,
        groupTitle: 'Notifications',
        children: [
            {
                id: 3.1,
                title: 'Notifications',
                icon: BellIcon,
                href: '/settings/notifications',
            },
            {
                id: 3.2,
                title: 'Notification Settings',
                icon: BellPlus,
                href: '/settings/setting_notifications',
            },
        ],
    },
]
