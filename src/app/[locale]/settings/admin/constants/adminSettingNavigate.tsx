import {
	BellIcon,
	BellPlus,
	CircleUserRound,
	Palette,
	Earth,
	ShieldPlus,
	SquareUserRound,
} from 'lucide-react'
import { SettingGroup } from '../../personal/constants/personalSettingNavigate'

export const ADMIN_SETTING_NAV: SettingGroup[] = [
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
				title: 'Login & Security',
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
				href: '/settings/appearance',
			},
			{
				id: 2.2,
				title: 'Language & Region',
				icon: Earth,
				href: '/settings/language_and_region',
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
