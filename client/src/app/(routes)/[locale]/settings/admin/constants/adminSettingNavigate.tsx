import {
    MonitorCog,
    UsersRound,
    BriefcaseBusiness,
    CircleDollarSign,
} from 'lucide-react'
import { SettingGroup } from '../../(user)/constants/personalSettingNavigate'

export const ADMIN_SETTING_NAV: SettingGroup[] = [
    {
        id: 1,
        groupTitle: 'System',
        children: [
            {
                id: 1.1,
                title: 'System  Configuration',
                href: '/system',
                icon: MonitorCog,
            },
        ],
    },
    {
        id: 2,
        groupTitle: 'Management',
        children: [
            {
                id: 2.1,
                title: 'Team',
                icon: UsersRound,
                href: '/settings/admin/manage/team',
            },
            {
                id: 2.2,
                title: 'Job',
                icon: BriefcaseBusiness,
                href: '/settings/admin/manage/job',
            },
            {
                id: 2.3,
                title: 'Payment',
                icon: CircleDollarSign,
                href: '/settings/admin/manage/job',
            },
        ],
    },
]
