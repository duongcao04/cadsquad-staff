import {
    BellIcon,
    BriefcaseBusiness,
    CircleDollarSign,
    MonitorCog,
    Newspaper,
    Palette,
    SquareUserRound,
    Users,
} from 'lucide-react'

export const ADMIN_SETTING_DROPDOWN = [
    {
        id: 1,
        groupTitle: 'Personal settings',
        children: [
            {
                id: 1.1,
                icon: SquareUserRound,
                title: 'Account settings',
                description: 'Manage language and other personal preferences.',
                href: '/settings/personal/account',
            },
            {
                id: 1.2,
                title: 'Appearance',
                icon: Palette,
                description: 'Manage how your public dashboard looks and feels',
                href: '/settings/personal/appearance',
            },
            {
                id: 1.3,
                title: 'Notification settings',
                icon: BellIcon,
                description:
                    'Manage email and in-product notification from site.',
                href: '/settings/personal/notifications',
            },
        ],
    },
    {
        id: 2,
        groupTitle: 'Admin settings',
        children: [
            {
                id: 2.1,
                icon: MonitorCog,
                title: 'System',
                description:
                    'Manage general configuration, security, automation and more.',
                href: '/settings/admin/system',
            },
            {
                id: 2.2,
                title: 'Job',
                icon: BriefcaseBusiness,
                description: 'Manage job type, overview analysis and more.',
                href: '/settings/admin/jobs',
            },
            {
                id: 2.3,
                title: 'Payment',
                icon: CircleDollarSign,
                description:
                    'Manage income, staff cost, payment method, overview analysis and more.',
                href: '/settings/admin/payments',
            },
            {
                id: 2.4,
                title: 'User management',
                icon: Users,
                description: 'Manage users, access request and more.',
                href: '/settings/admin/users',
            },
        ],
    },
    {
        id: 3,
        groupTitle: 'Cadsquad.vn settings',
        children: [
            {
                id: 2.1,
                icon: Newspaper,
                title: 'Articles',
                description: 'Manage, create new, edit articles and more.',
                href: '/settings/cadsquad/articles',
            },
        ],
    },
]

export const VI_ADMIN_SETTING_DROPDOWN = [
    {
        id: 1,
        groupTitle: 'Cài đặt cá nhân',
        children: [
            {
                id: 1.1,
                icon: SquareUserRound,
                title: 'Thông tin cá nhân',
                description: 'Quản lý ngôn ngữ và các tùy chọn cá nhân khác.',
                href: '/settings/personal/account',
            },
            {
                id: 1.2,
                title: 'Giao diện',
                icon: Palette,
                description: 'Quản lý cách bảng điều khiển công khai hiển thị.',
                href: '/settings/personal/appearance',
            },
            {
                id: 1.3,
                title: 'Thông báo',
                icon: BellIcon,
                description:
                    'Quản lý email và thông báo trong sản phẩm từ hệ thống.',
                href: '/settings/personal/notifications',
            },
        ],
    },
    {
        id: 2,
        groupTitle: 'Cài đặt quản trị',
        children: [
            {
                id: 2.1,
                icon: MonitorCog,
                title: 'Hệ thống',
                description: 'Quản lý cấu hình chung, bảo mật, tự động hóa,...',
                href: '/settings/admin/system',
            },
            {
                id: 2.2,
                title: 'Dự án',
                icon: BriefcaseBusiness,
                description: 'Quản lý loại công việc, phân tích tổng quan,...',
                href: '/settings/admin/jobs',
            },
            {
                id: 2.3,
                title: 'Thanh toán',
                icon: CircleDollarSign,
                description:
                    'Quản lý doanh thu, chi phí nhân sự, phương thức thanh toán, phân tích tổng quan.',
                href: '/settings/admin/payments',
            },
            {
                id: 2.4,
                title: 'Thành viên',
                icon: Users,
                description: 'Quản lý người dùng, yêu cầu truy cập,...',
                href: '/settings/admin/users',
            },
        ],
    },
    {
        id: 3,
        groupTitle: 'Cài đặt trang Cadsquad.vn',
        children: [
            {
                id: 2.1,
                icon: Newspaper,
                title: 'Bài viết',
                description: 'Quản lý, tạo mới, chỉnh sửa bài viết, ...',
                href: '/settings/cadsquad/articles',
            },
        ],
    },
]
