import {
    ApiResponse,
    darkenHexColor,
    EXTERNAL_URLS,
    getPageTitle,
    INTERNAL_URLS,
    lightenHexColor,
    optimizeCloudinary,
    PAID_STATUS_COLOR,
    useAdminDeliverJobMutation,
    useProfile,
    useRemoveMemberMutation,
} from '@/lib'
import {
    jobActivityLogsOptions,
    jobByNoOptions,
    jobDeliveriesListOptions,
    jobStatusesListOptions,
} from '@/lib/queries'
import {
    HeroBreadcrumbItem,
    HeroBreadcrumbs,
    HeroTooltip,
    JobActivityHistory,
} from '@/shared/components'
import AdminContentContainer from '@/shared/components/admin/AdminContentContainer'
import AdminDeliveryCard from '@/shared/components/management-jobs/AdminDeliveryCard'
import { AdminJobManageAccessModal } from '@/shared/components/modals/AdminJobManageAccessModal'
import AssignMembersModal from '@/shared/components/modals/AssignMembersModal'
import { ConfirmCancelJobModal } from '@/shared/components/modals/ConfirmCancelJobModal'
import { ConfirmRemoveAssigneeModal } from '@/shared/components/modals/ConfirmRemoveAssigneeModal'
import HeroCopyButton from '@/shared/components/ui/hero-copy-button'
import { TJob, TUser } from '@/shared/types'
import {
    Avatar,
    AvatarGroup,
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Select,
    SelectItem,
    Switch,
    Tab,
    Tabs,
    Textarea,
    useDisclosure,
} from '@heroui/react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useFormik } from 'formik'
import {
    Briefcase,
    ChevronLeft,
    Copy,
    DollarSign,
    Download,
    ExternalLink,
    FileText,
    MessageSquare,
    MoreVertical,
    Package,
    Paperclip,
    Printer,
    Save,
    Send,
    Trash2,
    Users,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import * as Yup from 'yup'
import { z } from 'zod'

export const manageJobDetailParamsSchema = z.object({
    tab: z
        .enum(['details', 'financials', 'deliveries', 'team', 'activity']) // 1. Restrict to valid tabs
        .catch('details'), // 2. If url is ?tab=garbage, fallback to 'details'
    // .default('details'), // 3. If ?tab is missing, default to 'details'
})

export type TManageJobDetailParams = z.infer<typeof manageJobDetailParamsSchema>
export const Route = createFileRoute('/_administrator/admin/mgmt/jobs/$no')({
    head: (ctx) => {
        const loader = ctx.loaderData as unknown as ApiResponse<TJob>
        return {
            meta: [
                { title: getPageTitle(loader?.result?.displayName ?? 'Job') },
            ],
        }
    },
    validateSearch: (search) => manageJobDetailParamsSchema.parse(search),
    loaderDeps: ({ search }) => ({ search }),
    loader: ({ context, params }) => {
        const { no } = params
        return context.queryClient.ensureQueryData(jobByNoOptions(no))
    },
    component: JobEditPage,
})

// --- Mock Data ---
const JOB_DATA = {
    // ... (Your existing mock data structure, keeping it identical for brevity)
    id: '1',
    no: 'FV-2024',
    title: 'E-Commerce Website Redesign',
    description:
        'Complete overhaul of the main storefront. Includes new cart logic, payment gateway integration (Stripe), and mobile responsiveness improvements.',
    clientName: 'TechCorp Industries',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    type: 'Web Development',
    incomeCost: 4500.0,
    staffCost: 1200.0,
    isPaid: false,
    isPublished: true,
    createdAt: '2024-02-01',
    dueAt: '2024-03-15',
    deliveries: [
        {
            id: 'd1',
            submittedBy: {
                name: 'Sarah Wilson',
                avatar: 'https://i.pravatar.cc/150?u=sarah',
            },
            status: 'REJECTED',
            note: 'Initial layout for home page. Please review header font sizes.',
            link: 'https://figma.com/file/xyz...',
            submittedAt: '2024-02-10 14:00',
            adminFeedback:
                'Header is too large on mobile. Please fix responsive breakpoints.',
        },
        {
            id: 'd2',
            submittedBy: {
                name: 'Sarah Wilson',
                avatar: 'https://i.pravatar.cc/150?u=sarah',
            },
            status: 'PENDING',
            note: 'Fixed mobile header issues and updated cart icon. Ready for final review.',
            link: 'https://staging.techcorp.com/v2',
            submittedAt: '2024-02-12 09:30',
            files: ['Screenshot_Mobile.png', 'Source_Code.zip'],
        },
    ],
    assignees: [
        {
            id: 'u1',
            name: 'Sarah Wilson',
            role: 'Lead Dev',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
        },
        {
            id: 'u2',
            name: 'David Chen',
            role: 'Designer',
            avatar: 'https://i.pravatar.cc/150?u=david',
        },
    ],
    files: [
        { name: 'Requirements_v2.pdf', size: '2.4 MB', date: 'Feb 02, 2024' },
        { name: 'Design_Mockups.fig', size: '12 MB', date: 'Feb 05, 2024' },
    ],
    activity: [
        {
            user: 'Sarah Wilson',
            action: 'changed status to',
            target: 'In Progress',
            time: '2 days ago',
        },
        {
            user: 'Admin',
            action: 'created job',
            target: 'FV-2024',
            time: '1 week ago',
        },
    ],
}

const PRIORITY_OPTIONS = [
    { key: 'LOW', label: 'Low' },
    { key: 'MEDIUM', label: 'Medium' },
    { key: 'HIGH', label: 'High' },
    { key: 'URGENT', label: 'Urgent' },
]

// --- VALIDATION SCHEMA ---
const JobValidationSchema = Yup.object().shape({
    title: Yup.string()
        .required('Job title is required')
        .min(3, 'Title must be at least 3 characters'),
    clientName: Yup.string().required('Client name is required'),
    priority: Yup.string().required('Priority is required'),
    status: Yup.string().required(),
    createdAt: Yup.date().required('Start date is required'),
    dueAt: Yup.date()
        .required('Due date is required')
        .min(Yup.ref('createdAt'), "Due date can't be before start date"),
    description: Yup.string().max(1000, 'Description too long'),
    incomeCost: Yup.number()
        .typeError('Must be a number')
        .min(0, 'Cannot be negative')
        .required('Required'),
    staffCost: Yup.number()
        .typeError('Must be a number')
        .min(0, 'Cannot be negative')
        .required('Required'),
    isPaid: Yup.boolean(),
})

function JobEditPage() {
    const { tab } = Route.useSearch() as TManageJobDetailParams
    const { no } = Route.useParams()
    const navigate = Route.useNavigate()
    const { resolvedTheme } = useTheme()

    const { data: profile } = useProfile()

    const adminDeliverJobAction = useAdminDeliverJobMutation()
    const [selectedMember, setSelectedMember] = useState<TUser | null>(null)

    const { data } = useSuspenseQuery({
        ...jobByNoOptions(no),
    })

    const { data: jobDeliveries } = useQuery({
        ...jobDeliveriesListOptions(data?.id as string),
        enabled: !!data?.id && tab === 'deliveries',
    })

    const { data: activityLogs, isFetching: isLoadingActivityLogs } = useQuery({
        ...jobActivityLogsOptions(data?.id as string),
        enabled: !!data?.id && tab === 'activity',
    })

    const {
        data: { jobStatuses },
    } = useSuspenseQuery({
        ...jobStatusesListOptions(),
    })

    const removeMemberMutation = useRemoveMemberMutation()

    const {
        isOpen: isAssignOpen,
        onOpen: onOpenAssignModal,
        onClose: onCloseAssignModal,
    } = useDisclosure({ id: 'AssigneeMembersModal' })

    const {
        isOpen: isManageAccessOpen,
        onOpen: onOpenManageAccessModal,
        onOpenChange: onCloseManageAccessModal,
    } = useDisclosure({ id: 'AdminManageAccessModal' })
    const {
        isOpen: isOpenConfirmCancelJobModal,
        onOpen: onOpenConfirmCancelJobModal,
        onOpenChange: onConfirmCancelModalChange,
    } = useDisclosure({ id: 'ConfirmCancelJobModal' })
    const {
        isOpen: isOpenConfirmRemoveAssigneeModal,
        onOpen: onOpenConfirmRemoveAssigneeModal,
        onOpenChange: onConfirmRemoveAssigneeModalChange,
        onClose: onCloseConfirmRemoveAssigneeModal,
    } = useDisclosure({ id: 'ConfirmRemoveAssigneeModal' })

    // --- FORMIK SETUP ---
    const formik = useFormik({
        initialValues: {
            // Using fetched data or defaults (ensure JOB_DATA properties exist on data)
            ...data,
            displayName: data?.displayName || '',
            clientName: data?.clientName || '',
            priority: data?.priority || 'MEDIUM',
            incomeCost: data?.incomeCost || 0,
            staffCost: data?.staffCost || 0,
            dueAt: data?.dueAt || '',
            createdAt: data?.createdAt || '',
            description: data?.description || '',
            isPaid: data?.isPaid || false,
        },
        validationSchema: JobValidationSchema,
        onSubmit: (values) => {
            // API Call would go here
            console.log('Submitting Form:', values)
            alert('Job Saved Successfully!')
        },
    })

    // Default to 'deliveries' if status is REVIEW for better UX
    const [activeTab, setActiveTab] = useState(tab)

    const handleChangeTab = (newTab: string) => {
        setActiveTab(
            newTab as
                | 'details'
                | 'financials'
                | 'deliveries'
                | 'team'
                | 'activity'
        )
        navigate({
            // Bây giờ 'old' sẽ có kiểu dữ liệu chính xác thay vì 'never'
            search: (old: TManageJobDetailParams) => {
                return {
                    ...old,
                    tab: newTab,
                } as never
            },
            replace: true,
        })
    }

    // --- Action Handlers (Integrated with Formik) ---
    const handleApprove = (deliveryId: string) => {
        adminDeliverJobAction.mutateAsync({
            deliveryId: deliveryId,
            action: 'approve',
        })
    }

    const handleReject = (deliveryId: string, feedback: string) => {
        adminDeliverJobAction.mutateAsync({
            deliveryId: deliveryId,
            action: 'reject',
            feedback,
        })
    }

    const handleRemoveMember = () => {
        if (data?.id && selectedMember) {
            removeMemberMutation.mutateAsync(
                {
                    jobId: data.id,
                    memberId: selectedMember.id,
                },
                {
                    onSuccess() {
                        onCloseConfirmRemoveAssigneeModal()
                        setSelectedMember(null)
                    },
                }
            )
        }
    }

    return (
        <div>
            {isOpenConfirmCancelJobModal && (
                <ConfirmCancelJobModal
                    isOpen={isOpenConfirmCancelJobModal}
                    onOpenChange={onConfirmCancelModalChange}
                    onConfirm={() => {}}
                />
            )}
            {isManageAccessOpen && data?.id && (
                <AdminJobManageAccessModal
                    isOpen={isManageAccessOpen}
                    onClose={onCloseManageAccessModal}
                    jobId={data.id}
                    jobTitle={data.no}
                    currentMembers={data.assignee}
                />
            )}
            {isAssignOpen && data?.id && (
                <AssignMembersModal
                    isOpen={isAssignOpen}
                    onClose={onCloseAssignModal}
                    jobId={data.id}
                    currentAssignees={data.assignee}
                />
            )}

            {isOpenConfirmRemoveAssigneeModal && (
                <ConfirmRemoveAssigneeModal
                    isOpen={isOpenConfirmRemoveAssigneeModal}
                    onOpenChange={onConfirmRemoveAssigneeModalChange}
                    onConfirm={handleRemoveMember}
                    isLoading={removeMemberMutation.isPending}
                    assignee={selectedMember ?? undefined}
                />
            )}
            <AdminContentContainer className="mt-1">
                <HeroBreadcrumbs className="text-xs">
                    <HeroBreadcrumbItem>
                        <Link
                            to={INTERNAL_URLS.admin}
                            className="text-text-subdued!"
                        >
                            Admin
                        </Link>
                    </HeroBreadcrumbItem>
                    <HeroBreadcrumbItem>
                        <Link
                            to={INTERNAL_URLS.jobManage}
                            className="text-text-subdued!"
                        >
                            Jobs
                        </Link>
                    </HeroBreadcrumbItem>
                    <HeroBreadcrumbItem>{data?.no}</HeroBreadcrumbItem>
                </HeroBreadcrumbs>

                <form onSubmit={formik.handleSubmit} className="mt-1">
                    {/* --- TOP NAVIGATION & BREADCRUMBS --- */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Link to={INTERNAL_URLS.jobManage}>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    className="text-text-subdued"
                                >
                                    <ChevronLeft size={20} />
                                </Button>
                            </Link>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold text-text-default">
                                        {formik.values.displayName ||
                                            'Untitled Job'}
                                    </h1>
                                    {data?.isPaid && (
                                        <Chip
                                            classNames={{
                                                content:
                                                    'flex items-center justify-start gap-2',
                                            }}
                                            variant="bordered"
                                        >
                                            <div
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        PAID_STATUS_COLOR[
                                                            data.isPaid
                                                                ? 'paid'
                                                                : 'unpaid'
                                                        ].hexColor,
                                                }}
                                            />
                                            {data.isPaid ? 'Paid' : 'Unpaid'}
                                        </Chip>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* --- QUICK ACTION TOOLBAR --- */}
                        <div className="flex flex-wrap items-center gap-2">
                            <HeroTooltip content="View Public Page">
                                <Button
                                    isIconOnly
                                    variant="flat"
                                    size="sm"
                                    onPress={() => {
                                        if (data?.no) {
                                            window.open(
                                                EXTERNAL_URLS.getJobDetailUrl(
                                                    data.no
                                                ),
                                                '_blank'
                                            )
                                        }
                                    }}
                                >
                                    <ExternalLink
                                        size={18}
                                        className="text-text-subdued"
                                    />
                                </Button>
                            </HeroTooltip>

                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        variant="flat"
                                        color="primary"
                                        endContent={<MoreVertical size={16} />}
                                    >
                                        Actions
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Quick Actions">
                                    <DropdownItem
                                        key="invoice"
                                        startContent={<FileText size={16} />}
                                    >
                                        Generate Invoice
                                    </DropdownItem>
                                    <DropdownItem
                                        key="duplicate"
                                        startContent={<Copy size={16} />}
                                    >
                                        Duplicate Job
                                    </DropdownItem>
                                    <DropdownItem
                                        key="print"
                                        startContent={<Printer size={16} />}
                                    >
                                        Print Job Sheet
                                    </DropdownItem>
                                    <DropdownItem
                                        key="delete"
                                        className="text-danger"
                                        color="danger"
                                        startContent={<Trash2 size={16} />}
                                    >
                                        Delete Job
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            <Button
                                color="primary"
                                startContent={<Save size={18} />}
                                // Trigger Formik Submit
                                onPress={() => formik.handleSubmit()}
                                isLoading={formik.isSubmitting}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* --- LEFT COLUMN: MAIN CONTENT --- */}
                        <div className="xl:col-span-2 space-y-6">
                            {/* Status & Progress Bar */}
                            <Card className="w-full shadow-sm border border-border-default">
                                <CardBody className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-medium text-text-subdued uppercase">
                                                Current Stage
                                            </span>
                                            <span
                                                className="font-bold text-lg"
                                                style={{
                                                    color: data?.status
                                                        .hexColor,
                                                }}
                                            >
                                                {data?.status.displayName}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {jobStatuses.map((opt) => (
                                                <Button
                                                    key={opt.id}
                                                    size="sm"
                                                    variant={
                                                        data?.status.code ===
                                                        opt.code
                                                            ? 'solid'
                                                            : 'bordered'
                                                    }
                                                    color={
                                                        formik.values.status ===
                                                        opt.id
                                                            ? (opt.hexColor as any)
                                                            : 'default'
                                                    }
                                                    onPress={() =>
                                                        formik.setFieldValue(
                                                            'status',
                                                            opt.id
                                                        )
                                                    }
                                                    style={{
                                                        backgroundColor:
                                                            resolvedTheme ===
                                                            'light'
                                                                ? lightenHexColor(
                                                                      opt?.hexColor,
                                                                      80
                                                                  )
                                                                : darkenHexColor(
                                                                      opt.hexColor,
                                                                      60
                                                                  ),
                                                    }}
                                                    className="min-w-0 px-3"
                                                >
                                                    {opt.displayName}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Visual Progress Mock */}
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                                        <div className="bg-emerald-500 w-[25%] h-full opacity-50"></div>
                                        <div className="bg-primary w-[25%] h-full"></div>
                                        <div className="bg-slate-200 w-[50%] h-full"></div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Main Tabs Form */}
                            <Card className="w-full shadow-sm border border-border-default min-h-[600px]">
                                <CardHeader className="p-0 border-b border-border-default">
                                    <Tabs
                                        aria-label="Job Edit Sections"
                                        variant="underlined"
                                        color="primary"
                                        classNames={{
                                            tabList: 'p-4 gap-6',
                                            cursor: 'w-full bg-primary',
                                            tab: 'max-w-fit px-0 h-10',
                                            tabContent:
                                                'group-data-[selected=true]:text-primary font-semibold text-text-subdued',
                                        }}
                                        selectedKey={activeTab}
                                        onSelectionChange={(k) =>
                                            handleChangeTab(k as string)
                                        }
                                    >
                                        <Tab
                                            key="details"
                                            title={
                                                <div className="flex items-center gap-2">
                                                    <Briefcase size={16} />{' '}
                                                    Details
                                                </div>
                                            }
                                        />
                                        <Tab
                                            key="financials"
                                            title={
                                                <div className="flex items-center gap-2">
                                                    <DollarSign size={16} />{' '}
                                                    Financials
                                                </div>
                                            }
                                        />
                                        <Tab
                                            key="deliveries"
                                            title={
                                                <div className="flex items-center gap-2">
                                                    <Package size={16} />{' '}
                                                    Deliveries
                                                </div>
                                            }
                                        />
                                        <Tab
                                            key="team"
                                            title={
                                                <div className="flex items-center gap-2">
                                                    <Users size={16} /> Team &
                                                    Files
                                                </div>
                                            }
                                        />
                                        <Tab
                                            key="activity"
                                            title={
                                                <div className="flex items-center gap-2">
                                                    <MessageSquare size={16} />{' '}
                                                    Activity
                                                </div>
                                            }
                                        />
                                    </Tabs>
                                </CardHeader>

                                <CardBody className="p-6">
                                    {/* --- TAB: DETAILS --- */}
                                    {activeTab === 'details' && (
                                        <div className="space-y-6 animate-in fade-in">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2">
                                                    <Input
                                                        name="displayName"
                                                        label="Display Name"
                                                        labelPlacement="outside"
                                                        placeholder="e.g. Website Redesign"
                                                        value={
                                                            formik.values
                                                                .displayName
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        isInvalid={
                                                            !!formik.errors
                                                                .displayName &&
                                                            formik.touched
                                                                .displayName
                                                        }
                                                        errorMessage={
                                                            formik.touched
                                                                .displayName &&
                                                            (formik.errors
                                                                .displayName as string)
                                                        }
                                                        variant="bordered"
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        name="clientName"
                                                        label="Client Name"
                                                        labelPlacement="outside"
                                                        placeholder="Client Company"
                                                        value={
                                                            formik.values
                                                                .clientName
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        isInvalid={
                                                            !!formik.errors
                                                                .clientName &&
                                                            formik.touched
                                                                .clientName
                                                        }
                                                        errorMessage={
                                                            formik.touched
                                                                .clientName &&
                                                            (formik.errors
                                                                .clientName as string)
                                                        }
                                                        variant="bordered"
                                                        startContent={
                                                            <Briefcase
                                                                size={16}
                                                                className="text-text-subdued"
                                                            />
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Select
                                                        name="priority"
                                                        label="Priority"
                                                        labelPlacement="outside"
                                                        placeholder="Select Priority"
                                                        selectedKeys={
                                                            new Set([
                                                                formik.values
                                                                    .priority,
                                                            ])
                                                        }
                                                        onSelectionChange={(
                                                            keys
                                                        ) => {
                                                            formik.setFieldValue(
                                                                'priority',
                                                                Array.from(
                                                                    keys
                                                                )[0] as string
                                                            )
                                                        }}
                                                        isInvalid={
                                                            !!formik.errors
                                                                .priority &&
                                                            formik.touched
                                                                .priority
                                                        }
                                                        errorMessage={
                                                            formik.touched
                                                                .priority &&
                                                            (formik.errors
                                                                .priority as string)
                                                        }
                                                        variant="bordered"
                                                    >
                                                        {PRIORITY_OPTIONS.map(
                                                            (p) => (
                                                                <SelectItem
                                                                    key={p.key}
                                                                    textValue={
                                                                        p.label
                                                                    }
                                                                >
                                                                    {p.label}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Input
                                                        type="date"
                                                        name="createdAt"
                                                        label="Start Date"
                                                        labelPlacement="outside"
                                                        value={
                                                            formik.values
                                                                .createdAt
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        isInvalid={
                                                            !!formik.errors
                                                                .createdAt &&
                                                            formik.touched
                                                                .createdAt
                                                        }
                                                        errorMessage={
                                                            formik.touched
                                                                .createdAt &&
                                                            (formik.errors
                                                                .createdAt as string)
                                                        }
                                                        variant="bordered"
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        type="date"
                                                        name="dueAt"
                                                        label="Due Date"
                                                        labelPlacement="outside"
                                                        value={
                                                            formik.values.dueAt
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        isInvalid={
                                                            !!formik.errors
                                                                .dueAt &&
                                                            formik.touched.dueAt
                                                        }
                                                        errorMessage={
                                                            formik.touched
                                                                .dueAt &&
                                                            (formik.errors
                                                                .dueAt as string)
                                                        }
                                                        variant="bordered"
                                                        // Simple color logic based on date
                                                        color={
                                                            formik.values
                                                                .dueAt &&
                                                            new Date(
                                                                formik.values
                                                                    .dueAt
                                                            ) < new Date()
                                                                ? 'danger'
                                                                : 'default'
                                                        }
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Textarea
                                                        name="description"
                                                        label="Description / Scope of Work"
                                                        labelPlacement="outside"
                                                        placeholder="Describe the job details..."
                                                        minRows={6}
                                                        value={
                                                            formik.values
                                                                .description
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        variant="bordered"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- TAB: DELIVERIES --- */}
                                    {activeTab === 'deliveries' && (
                                        <div className="space-y-6 animate-in fade-in">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-bold text-text-default text-lg">
                                                    Submission History
                                                </h3>
                                                <span className="text-xs text-text-subdued">
                                                    {jobDeliveries?.length}{' '}
                                                    total submissions
                                                </span>
                                            </div>

                                            {/* Warning Banner if waiting for review */}
                                            {/* {formik.values.status.code ===
                                                'REVIEW' && (
                                                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 mb-6">
                                                    <AlertTriangle
                                                        className="text-amber-600 mt-0.5"
                                                        size={20}
                                                    />
                                                    <div>
                                                        <h4 className="font-bold text-amber-900 text-sm">
                                                            Action Required
                                                        </h4>
                                                        <p className="text-xs text-amber-800 mt-1">
                                                            A team member has
                                                            submitted work for
                                                            approval. Please review
                                                            the pending delivery
                                                            below.
                                                        </p>
                                                    </div>
                                                </div>
                                            )} */}

                                            <div className="space-y-4">
                                                {jobDeliveries?.length ===
                                                    0 && (
                                                    <p className="text-center text-text-subdued">
                                                        No deliveries submission
                                                        history found.
                                                    </p>
                                                )}
                                                {jobDeliveries &&
                                                    jobDeliveries?.length > 0 &&
                                                    jobDeliveries.map(
                                                        (delivery) => (
                                                            <AdminDeliveryCard
                                                                key={
                                                                    delivery.id
                                                                }
                                                                delivery={
                                                                    delivery
                                                                }
                                                                onApprove={
                                                                    handleApprove
                                                                }
                                                                onReject={
                                                                    handleReject
                                                                }
                                                                isLoading={
                                                                    adminDeliverJobAction.isPending
                                                                }
                                                            />
                                                        )
                                                    )}
                                            </div>
                                        </div>
                                    )}

                                    {/* --- TAB: FINANCIALS --- */}
                                    {activeTab === 'financials' && (
                                        <div className="space-y-6 animate-in fade-in">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Card className="bg-emerald-50 dark:bg-emerald-50/10 border border-emerald-100 dark:border-emerald-100/50 shadow-none">
                                                    <CardBody className="p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <label className="text-xs font-bold text-emerald-700 uppercase">
                                                                Total Income
                                                            </label>
                                                            <DollarSign
                                                                size={16}
                                                                className="text-emerald-600"
                                                            />
                                                        </div>
                                                        <Input
                                                            name="incomeCost"
                                                            type="number"
                                                            size="lg"
                                                            placeholder="0.00"
                                                            startContent={
                                                                <span className="text-emerald-700 font-bold">
                                                                    $
                                                                </span>
                                                            }
                                                            value={String(
                                                                formik.values
                                                                    .incomeCost
                                                            )}
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                            isInvalid={
                                                                !!formik.errors
                                                                    .incomeCost &&
                                                                formik.touched
                                                                    .incomeCost
                                                            }
                                                            errorMessage={
                                                                formik.touched
                                                                    .incomeCost &&
                                                                (formik.errors
                                                                    .incomeCost as string)
                                                            }
                                                            classNames={{
                                                                inputWrapper:
                                                                    'bg-background',
                                                                input: 'font-bold text-emerald-700',
                                                            }}
                                                        />
                                                        <p className="text-xs text-emerald-600 mt-2">
                                                            Amount billable to
                                                            client
                                                        </p>
                                                    </CardBody>
                                                </Card>

                                                <Card className="bg-orange-50 dark:bg-orange-50/10 border border-orange-100 dark:border-orange-100/50 shadow-none">
                                                    <CardBody className="p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <label className="text-xs font-bold text-orange-700 uppercase">
                                                                Staff Cost
                                                                (COGS)
                                                            </label>
                                                            <Users
                                                                size={16}
                                                                className="text-orange-600"
                                                            />
                                                        </div>
                                                        <Input
                                                            name="staffCost"
                                                            type="number"
                                                            size="lg"
                                                            placeholder="0.00"
                                                            startContent={
                                                                <span className="text-orange-700 font-bold">
                                                                    $
                                                                </span>
                                                            }
                                                            value={String(
                                                                formik.values
                                                                    .staffCost
                                                            )}
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                            isInvalid={
                                                                !!formik.errors
                                                                    .staffCost &&
                                                                formik.touched
                                                                    .staffCost
                                                            }
                                                            errorMessage={
                                                                formik.touched
                                                                    .staffCost &&
                                                                (formik.errors
                                                                    .staffCost as string)
                                                            }
                                                            classNames={{
                                                                inputWrapper:
                                                                    'bg-background',
                                                                input: 'font-bold text-orange-700',
                                                            }}
                                                        />
                                                        <p className="text-xs text-orange-600 mt-2">
                                                            Total payout to
                                                            assignees
                                                        </p>
                                                    </CardBody>
                                                </Card>
                                            </div>

                                            <Divider />

                                            <div className="flex items-center justify-between p-4 border border-border-default rounded-xl">
                                                <div>
                                                    <h4 className="font-bold text-text-default">
                                                        Payment Status
                                                    </h4>
                                                    <p className="text-sm text-text-subdued">
                                                        Has the client paid for
                                                        this job?
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`text-sm font-bold ${formik.values.isPaid ? 'text-emerald-600' : 'text-text-subdued'}`}
                                                    >
                                                        {formik.values.isPaid
                                                            ? 'PAID'
                                                            : 'UNPAID'}
                                                    </span>
                                                    <Switch
                                                        isSelected={
                                                            formik.values.isPaid
                                                        }
                                                        onValueChange={(val) =>
                                                            formik.setFieldValue(
                                                                'isPaid',
                                                                val
                                                            )
                                                        }
                                                        color="success"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <Button
                                                    color="primary"
                                                    variant="flat"
                                                    startContent={
                                                        <FileText size={16} />
                                                    }
                                                >
                                                    Create/View Invoice
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- TAB: TEAM & FILES --- */}
                                    {activeTab === 'team' && (
                                        <div className="space-y-8 animate-in fade-in">
                                            {/* Team Section */}
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-bold text-text-default flex items-center gap-2">
                                                        <Users size={18} />{' '}
                                                        Assigned Members
                                                    </h3>
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        color="primary"
                                                        startContent={
                                                            <Users size={14} />
                                                        }
                                                        onPress={
                                                            onOpenManageAccessModal
                                                        }
                                                    >
                                                        Manage Access
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {data?.assignee.map(
                                                        (user: TUser) => (
                                                            <div
                                                                key={user.id}
                                                                className="flex items-center justify-between p-3 border border-border-default rounded-xl hover:border-primary transition-colors cursor-pointer group"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar
                                                                        src={optimizeCloudinary(
                                                                            user.avatar,
                                                                            {
                                                                                width: 256,
                                                                                height: 256,
                                                                            }
                                                                        )}
                                                                    />
                                                                    <div>
                                                                        <p className="font-bold text-sm text-text-subdued">
                                                                            {
                                                                                user.displayName
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-text-subdued">
                                                                            @
                                                                            {
                                                                                user.username
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <HeroTooltip
                                                                    content={`Remove @${user.username}`}
                                                                >
                                                                    <Button
                                                                        isIconOnly
                                                                        size="sm"
                                                                        variant="light"
                                                                        color="danger"
                                                                        className="opacity-0 group-hover:opacity-100"
                                                                        onPress={() => {
                                                                            onOpenConfirmRemoveAssigneeModal()
                                                                            setSelectedMember(
                                                                                user
                                                                            )
                                                                        }}
                                                                    >
                                                                        <Trash2
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </Button>
                                                                </HeroTooltip>
                                                            </div>
                                                        )
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="border border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 h-[66px] text-text-subdued hover:text-primary hover:border-primary hover:bg-primary-50 transition-all"
                                                        onClick={
                                                            onOpenAssignModal
                                                        }
                                                    >
                                                        <Users size={18} />
                                                        Add Member
                                                    </button>
                                                </div>
                                            </div>

                                            <Divider />

                                            {/* Files Section */}
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-bold text-text-default flex items-center gap-2">
                                                        <Paperclip size={18} />{' '}
                                                        Attachments
                                                    </h3>
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        color="primary"
                                                    >
                                                        Upload New
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    {JOB_DATA.files.map(
                                                        (
                                                            file: any,
                                                            idx: any
                                                        ) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-white rounded-md border border-border-default text-red-500">
                                                                        <FileText
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-semibold text-text-subdued hover:text-primary hover:underline cursor-pointer">
                                                                            {
                                                                                file.name
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-text-subdued">
                                                                            {
                                                                                file.size
                                                                            }{' '}
                                                                            •{' '}
                                                                            {
                                                                                file.date
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    isIconOnly
                                                                    size="sm"
                                                                    variant="light"
                                                                >
                                                                    <Download
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </Button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- TAB: ACTIVITY --- */}
                                    {activeTab === 'activity' && (
                                        <div className="space-y-4 animate-in fade-in">
                                            <div className="flex gap-4">
                                                <Avatar
                                                    src={optimizeCloudinary(
                                                        profile.avatar,
                                                        {
                                                            width: 256,
                                                            height: 256,
                                                        }
                                                    )}
                                                    className="w-10 h-10"
                                                />
                                                <div className="flex-1">
                                                    <Textarea
                                                        placeholder="Add a comment or note..."
                                                        minRows={2}
                                                        variant="faded"
                                                        className="mb-2"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        color="primary"
                                                        startContent={
                                                            <Send size={14} />
                                                        }
                                                    >
                                                        Post Comment
                                                    </Button>
                                                </div>
                                            </div>

                                            <Divider className="my-4" />

                                            <JobActivityHistory
                                                logs={activityLogs}
                                                isLoading={
                                                    isLoadingActivityLogs
                                                }
                                            />
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>

                        {/* --- RIGHT COLUMN: SIDEBAR --- */}
                        <div className="space-y-6">
                            {/* Meta Info Card */}
                            <Card className="w-full shadow-sm border border-border-default">
                                <CardHeader className="bg-background-muted border-b border-border-default px-4 py-3">
                                    <h3 className="text-sm font-bold text-text-subdued">
                                        Job Information
                                    </h3>
                                </CardHeader>
                                <CardBody className="p-4 space-y-4">
                                    {data?.no && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-text-subdued">
                                                Job No.
                                            </span>
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="text-sm font-mono font-bold bg-background-hovered px-2 py-0.5 rounded">
                                                    {data.no}
                                                </span>
                                                <HeroCopyButton
                                                    textValue={data.no}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-text-subdued">
                                            Created
                                        </span>
                                        <span className="text-sm font-semibold">
                                            {data?.createdBy.displayName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-text-subdued">
                                            Job Type
                                        </span>
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            style={{
                                                backgroundColor: data?.type
                                                    ?.hexColor
                                                    ? data?.type?.hexColor
                                                    : 'var(--background-hovered)',
                                            }}
                                            className="text-white!"
                                        >
                                            {data?.type?.displayName}
                                        </Chip>
                                    </div>
                                    <Divider />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-text-subdued">
                                            Published
                                        </span>
                                        <Switch
                                            size="sm"
                                            isSelected={
                                                formik.values.isPublished
                                            }
                                            onValueChange={(val) =>
                                                formik.setFieldValue(
                                                    'isPublished',
                                                    val
                                                )
                                            }
                                        />
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Quick Assign Card */}
                            <Card className="w-full shadow-sm border border-border-default bg-primary-50 dark:bg-primary-50/80">
                                <CardBody className="p-4">
                                    <h4 className="font-bold text-primary mb-2 text-sm">
                                        Need help?
                                    </h4>
                                    <p className="text-xs text-primary-700 mb-3">
                                        Assign more team members to speed up
                                        this job.
                                    </p>
                                    {data?.assignee.length ? (
                                        <AvatarGroup
                                            isBordered
                                            max={4}
                                            size="sm"
                                            className="justify-start mb-3"
                                            isDisabled
                                        >
                                            {data?.assignee.map((as) => {
                                                return (
                                                    <Avatar
                                                        src={optimizeCloudinary(
                                                            as.avatar
                                                        )}
                                                        classNames={{
                                                            base: 'opacity-100!',
                                                        }}
                                                    />
                                                )
                                            })}
                                        </AvatarGroup>
                                    ) : (
                                        <></>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        color="primary"
                                        className="w-full"
                                        onPress={onOpenAssignModal}
                                    >
                                        Assign Members
                                    </Button>
                                </CardBody>
                            </Card>

                            {/* Danger Zone */}
                            <Card className="w-full shadow-none border border-danger/10 bg-danger/10">
                                <CardBody className="p-4">
                                    <h4 className="font-bold text-danger mb-2 text-sm">
                                        Danger Zone
                                    </h4>
                                    <Button
                                        size="sm"
                                        variant="light"
                                        color="danger"
                                        className="w-full justify-start"
                                        startContent={<Trash2 size={16} />}
                                        onPress={onOpenConfirmCancelJobModal}
                                    >
                                        Delete this Job
                                    </Button>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </form>
            </AdminContentContainer>
        </div>
    )
}
