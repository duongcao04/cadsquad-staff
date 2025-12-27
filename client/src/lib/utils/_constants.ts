import { capitalize } from 'lodash'
import {
    CircleUserRound,
    House,
    LifeBuoy,
    Settings,
    SquareUser,
    SwatchBook,
    UsersRound,
} from 'lucide-react'
import { envConfig } from '@/lib/config'
import type { JobColumn, JobColumnKey } from '@/shared/types'
import { RoleEnum } from '../../shared/enums'

export const LS_OIDC_REDIRECT_URI_KEY = 'oidc:redirect_uri' as const

export const COOKIES = {
    authentication: 'csd-authTk',
}

export const EXTERNAL_URLS = {
    getJobDetailUrl: (jobNo: string, locale?: string) => {
        if (!locale) return envConfig.APP_URL + '/' + 'jobs' + '/' + jobNo
        return envConfig.APP_URL + '/' + locale + '/' + 'jobs' + '/' + jobNo
    },
}
export const INTERNAL_URLS = {
    home: '/',
    projectCenter: '/' + 'project-center',
    workbench: '/',
    getJobDetailUrl: (jobNo: string, locale?: string) => {
        if (!locale) return '/' + 'jobs' + '/' + jobNo
        return '/' + locale + '/' + 'jobs' + '/' + jobNo
    },
    profile: '/' + 'profile',
    userOverview: '/' + 'overview',
    userTaskSummary: '/' + 'task-summary',
    helpCenter: '/' + 'help-center',
    /**
     * AUTH ROUTES
    */
    auth: '/' + 'auth',
    login: '/' + 'login',
    /**
     * SETTINGS ROUTES
    */
    settings: '/' + 'settings',
    accountSettings: '/' + 'settings/my-profile',
    loginAndSecurity: '/' + 'settings/login-and-security',
    notificationsSettings: '/' + 'settings/notifications',
    languageAndRegionSettings: '/' + 'settings/language-and-region',
    /**
     * ADMIN ROUTES
     */
    admin: '/' + 'admin',
    systemConfiguration: '/' + 'admin/settings',
    schedule: '/' + 'admin/schedule',
    // MANAGEMENT
    appearance: '/' + 'settings/appearance',
    fileDocs: '/' + 'admin/mgmt/file-docs',
    staffDirectory: '/' + 'admin/mgmt/staff-directory',
    editStaffDetails: (username: string) => '/' + 'admin/mgmt/staff-directory/' + username + '/edit',
    inviteMember: '/' + 'admin/mgmt/invite-member',
    revenueReports: '/' + 'admin/mgmt/revenue',
    teamManage: '/' + 'admin/mgmt/staff-directory',
    jobManage: '/' + 'admin/mgmt/jobs',
    departmentsManage: '/' + 'admin/departments',
    departmentItemManage: (departmentCode: string) => '/' + 'admin/departments/' + departmentCode,
    editJob: (jobNo: string) => '/' + 'admin/mgmt/jobs/' + jobNo,
    paymentManage: '/' + 'admin/mgmt/payments',
    /**
     * FINANCIAL ROUTES
    */
    payment: '/' + 'financial/payment',
    invoiceTemplates: '/' + 'financial/invoice-templates',
    pendingPayouts: '/' + 'financial/pending-payouts',
    payroll: '/' + 'financial/payroll',
    profitLoss: '/' + 'financial/profit-loss',
    reimbursements: '/' + 'financial/reimbursements',
    financialSettings: '/' + 'financial/setting',
    /**
     * COMMUNITIES
     */
    communities: "/" + 'communities',
    getCommunityUrl: (communityCode: string) => "/" + 'communities/' + communityCode,
    getCommunityTopicUrl: (communityCode: string, topicCode: string) => "/" + 'communities/' + communityCode + '/' + topicCode
}

export const WEB_PAGES = [
    {
        icon: House, // Placeholder for Home icon
        displayName: 'Workbench',
        url: '/',
    },
    {
        icon: LifeBuoy, // Placeholder for Project Center icon
        displayName: 'Project Center',
        url: '/project-center',
    },
    {
        icon: CircleUserRound, // Placeholder for Profile icon
        displayName: 'Profile',
        url: '/profile',
    },
    {
        icon: Settings, // Placeholder for Settings icon
        displayName: 'Settings',
        url: '/settings',
    },
    {
        icon: UsersRound, // Placeholder for Manage Team icon
        displayName: 'Manage Team',
        url: '/admin/mgmt/team',
    },
    {
        icon: SquareUser, // Placeholder for Manage Team icon
        displayName: 'Account settings',
        url: '/settings/personal_details',
    },
    {
        icon: SwatchBook, // Placeholder for Manage Team icon
        displayName: 'Appearance',
        url: '/settings/appearance',
    },
]

export const baseUrl = envConfig.APP_URL ?? 'http://localhost'
export const apiBaseUrl = envConfig.API_ENDPOINT
    ? `${envConfig.API_ENDPOINT}/api`
    : 'https://testapi.appnavotar.com/api'

export const STORAGE_KEYS = {
    theme: 'theme',
    dateFormat: 'app-runtime:date-format',
    timeFormat: 'app-runtime:time-format',
    dismissedMessages: 'app-runtime:dismissed-messages',
    tableRowCount: 'app-runtime:table-row-count',
    currency: 'app-runtime:currency',
    currencyDigits: 'app-runtime:currency-digits',
    projectCenterFinishItems: 'project-center-finish-items',
    sidebarStatus: 'csd-side',
    adminRightSidebar: 'csd_admin-right-sidebar',
    adminLeftSidebar: 'csd_admin-left-sidebar',
    communitiesLeftStatus: 'csd_communities-left-sidebar',
    jobColumns: 'csd-job_columns',
} as const

export const IMAGES = {
    loadingPlaceholder: 'https://placehold.co/400x400?text=Loading',
    emptyAvatar:
        'https://res.cloudinary.com/dqx1guyc0/image/upload/v1762496668/.temp/empty_avatar_wai3iw.webp',
} as const

const allJobColumns: JobColumn[] = [
    'no',
    'type',
    'thumbnail',
    'displayName',
    'description',
    'attachmentUrls',
    'clientName',
    'incomeCost',
    'staffCost',
    'assignee',
    'paymentChannel',
    'status',
    'isPaid',
    'dueAt',
    'completedAt',
    'createdAt',
    'updatedAt',
    'action',
]

export const USER_CONFIG_KEYS = {
    jobShowColumns: 'job-show-columns',
    hideFinishItems: 'project-center-activeTab-hide-finish-items',
}

export const USER_CONFIG_VALUES = {
    allJobColumns: {
        user: allJobColumns.filter((item) => item !== 'incomeCost'),
        admin: allJobColumns,
    },
}

export const STORAGE_DEFAULTS = {
    tableRowCount: '10',
    currencyDigits: '2',
    theme: 'system' as const,
}

export const UI_APPLICATION_NAME = envConfig.APP_TITLE ?? 'Cadsquad Staff'
export const DEPLOYMENT_ENV = import.meta.env.NODE_ENV || 'development'

export const IS_DEV = DEPLOYMENT_ENV !== 'production'
export const APP_VERSION = envConfig.APP_VERSION ?? '0.0.0-release'

export const SETTINGS_LOCATION_KEYS = {
    application: 'application',
    profile: 'profile',
    runtimeConfiguration: 'runtime-configuration',
    vehiclesAndCategories: 'vehicles-and-categories',
    ratesAndCharges: 'rates-and-charges',
} as const

export const DATE_FORMATS = {
    hyphen: 'DD-MM-YYYY',
    dashed: 'DD/MM/YYYY',
}

export const TIMEZONE = 'Asia/Ho_Chi_Minh'

export const PROJECT_CENTER_TABS = {
    active: 'active',
    priority: 'priority',
    late: 'late',
    delivered: 'delivered',
    completed: 'completed',
    cancelled: 'cancelled',
}

export const JOB_STATUS_CODES = {
    inProgress: 'in-progress',
    delivered: 'delivered',
    revision: 'revision',
    finish: 'finish',
    completed: 'completed',
}

export const ACTIVITY_LOG_TYPE = {
    createJob: 'CreateJob',
    changeStatus: 'ChangeStatus',
    assignMember: 'AssignMember',
    unassignMember: 'UnassignMember',
    changePaymentChannel: 'ChangePaymentChannel',
    updateInformation: 'UpdateInformation',
    deleteJob: 'DeleteJob',
}

export const THEME_SELECTS = [
    { key: 'system', label: 'System' },
    { key: 'light', label: 'Light' },
    { key: 'dark', label: 'Dark' },
]

export const PAID_STATUS_COLOR: Record<
    string,
    { title: string; hexColor: string }
> = {
    paid: {
        title: 'Paid',
        hexColor: '#2a9174',
    },
    unpaid: {
        title: 'Unpaid',
        hexColor: '#f83640',
    },
}

export const PAID_STATUS_ARRAY = Object.entries(PAID_STATUS_COLOR).map(
    ([key, value]) => ({
        key, // 'paid', 'unpaid'
        ...value,
    })
)

export const JOB_COLUMNS: {
    displayName: string
    uid: JobColumnKey
    sortable: boolean
    description?: string
}[] = [
        {
            displayName: 'Thumbnail',
            uid: 'thumbnailUrl',
            sortable: false,
            description: 'Preview image representing the project.',
        },
        {
            displayName: 'Client',
            uid: 'clientName',
            sortable: false,
            description: 'Name of the client associated with the project.',
        },
        {
            displayName: 'Job type',
            uid: 'type',
            sortable: true,
            description: 'Category or type of the job.',
        },
        {
            displayName: 'Job no',
            uid: 'no',
            sortable: true,
            description: 'Unique job or project number identifier.',
        },
        {
            displayName: 'Job name',
            uid: 'displayName',
            sortable: true,
            description: 'Official name or title of the job or project.',
        },
        {
            displayName: 'Income',
            uid: 'incomeCost',
            sortable: true,
            description: 'Total income or revenue generated from the project.',
        },
        {
            displayName: 'Staff Cost',
            uid: 'staffCost',
            sortable: true,
            description: 'Total cost associated with staff working on the project.',
        },
        {
            displayName: 'Status',
            uid: 'status',
            sortable: false,
            description: 'Current status of the project (e.g., Active, Completed).',
        },
        {
            displayName: 'Due on',
            uid: 'dueAt',
            sortable: true,
            description: 'Deadline or due date for the project.',
        },
        {
            displayName: 'Attachments',
            uid: 'attachmentUrls',
            sortable: false,
            description:
                'List of attached files or documents related to the project.',
        },
        {
            displayName: 'Assignee',
            uid: 'assignee',
            sortable: false,
            description: 'Person or team assigned to handle the project.',
        },
        {
            displayName: 'Payment status',
            uid: 'isPaid',
            sortable: true,
            description: 'Indicates whether the project has been paid for.',
        },
        {
            displayName: 'Payment channel',
            uid: 'paymentChannel',
            sortable: false,
            description: 'Payment method or channel used (e.g., Bank, Cash).',
        },
        {
            displayName: 'Completed at',
            uid: 'completedAt',
            sortable: true,
            description: 'Date and time when the project was completed.',
        },
        {
            displayName: 'Created at',
            uid: 'createdAt',
            sortable: true,
            description: 'Date and time when the project record was created.',
        },
        {
            displayName: 'Modified at',
            uid: 'updatedAt',
            sortable: true,
            description: 'Date and time of the most recent modification.',
        },
        {
            displayName: 'Actions',
            uid: 'action',
            sortable: false,
            description: 'Available actions such as view, edit, or delete.',
        },
    ]

export const USER_COLUMNS = [
    {
        uid: 'displayName',
        displayName: 'Display Name',
        sortable: true,
        width: '100px',
    },
    { uid: 'email', displayName: 'Email', sortable: true, width: '100px' },
    {
        uid: 'phoneNumber',
        displayName: 'Phone Number',
        sortable: true,
    },
    {
        uid: 'department',
        displayName: 'Department',
        sortable: true,
    },
    {
        uid: 'jobTitle',
        displayName: 'Job Title',
        sortable: true,
    },
    { uid: 'isActive', displayName: 'Status', sortable: true },
    { uid: 'lastLoginAt', displayName: 'Last Login', sortable: true },
    { uid: 'createdAt', displayName: 'Created At', sortable: true },
    { uid: 'action', displayName: 'Action', sortable: false },
]

export const TABLE_ROW_PER_PAGE_OPTIONS = [
    { displayName: '5 items', value: 5, key: '5items' },
    { displayName: '10 items', value: 10, key: '10items' },
    { displayName: '15 items', value: 15, key: '15items' },
    { displayName: '20 items', value: 20, key: '20items' },
]

export const APP_THEMES = [
    {
        id: 1,
        title: 'Light',
        code: 'light',
        thumbnail:
            'https://jira-frontend-bifrost.prod-east.frontend.public.atl-paas.net/assets/very-specific-illu.theme-choice--light.f6e5e7a6.png',
    },
    {
        id: 2,
        title: 'Dark',
        code: 'dark',
        thumbnail:
            'https://jira-frontend-bifrost.prod-east.frontend.public.atl-paas.net/assets/very-specific-illu.theme-choice--dark.d20b635b.png',
    },
    {
        id: 3,
        title: 'System',
        code: 'system',
        thumbnail:
            'https://jira-frontend-bifrost.prod-east.frontend.public.atl-paas.net/assets/very-specific-illu.theme-choice--auto.86589aea.png',
    },
]

// TODO: fix thumbnail
export const APP_TABLE_SIZES = [
    {
        id: 1,
        title: 'Small',
        code: 'small',
        thumbnail:
            'https://jira-frontend-bifrost.prod-east.frontend.public.atl-paas.net/assets/very-specific-illu.theme-choice--light.f6e5e7a6.png',
    },
    {
        id: 2,
        title: 'Medium',
        code: 'medium',
        thumbnail:
            'https://jira-frontend-bifrost.prod-east.frontend.public.atl-paas.net/assets/very-specific-illu.theme-choice--dark.d20b635b.png',
    },
    {
        id: 3,
        title: 'Large',
        code: 'large',
        thumbnail:
            'https://jira-frontend-bifrost.prod-east.frontend.public.atl-paas.net/assets/very-specific-illu.theme-choice--auto.86589aea.png',
    },
]

export const DUE_DATE_PRESETS = [
    { key: 'lt_1_week', label: '< 1 week' },
    { key: 'lt_2_weeks', label: '< 2 weeks' }, // Corrected "week" to "weeks"
    { key: 'lt_3_weeks', label: '< 3 weeks' }, // Corrected "week" to "weeks"
    { key: 'lt_1_month', label: '< 1 month' },
    { key: 'gt_1_month', label: '> 1 month' },
] as const

export type DueDatePresetKey = (typeof DUE_DATE_PRESETS)[number]['key']

export const ROLES_LIST = Object.entries(RoleEnum).map((i) => {
    return {
        ...i,
        label: capitalize(i[1].toLowerCase().replaceAll('_', ' ')),
        value: i[0],
    }
})
