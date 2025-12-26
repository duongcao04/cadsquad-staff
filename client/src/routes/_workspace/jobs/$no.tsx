import {
    ApiResponse,
    dateFormatter,
    EXTERNAL_URLS,
    formatCurrencyVND,
    getPageTitle,
    INTERNAL_URLS,
    optimizeCloudinary,
    PAID_STATUS_COLOR,
    useUpdateJobMutation,
} from '@/lib' // Adjusted import path to alias
import { jobActivityLogsOptions, jobByNoOptions } from '@/lib/queries'
import Timmer from '@/shared/components/layouts/PageHeading/Timmer'
import {
    HeroBreadcrumbItem,
    HeroBreadcrumbs,
} from '@/shared/components/ui/hero-breadcrumbs' // Assuming you have this from previous context
import { TJob } from '@/shared/types'
import {
    addToast,
    Avatar,
    Button,
    CardBody,
    Chip,
    Divider,
    Skeleton,
    Snippet,
    Spacer,
    Tab,
    Tabs,
    Textarea,
} from '@heroui/react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import {
    Banknote,
    Briefcase,
    CalendarDays,
    ChevronLeft,
    CirclePlus,
    FileText,
    Flag,
    House,
    LibraryBig,
    LinkIcon,
    MessageSquare,
    Paperclip,
    RotateCcw,
    Send,
    Trash2,
    UserRound,
} from 'lucide-react'
import React from 'react'
import {
    HeroButton,
    HeroCard,
    HeroCardBody,
    HeroCardHeader,
    JobActivityHistory,
    ScrollArea,
    ScrollBar,
} from '../../../shared/components'
import JobDescriptionView from '../../../shared/components/job-detail/JobDescriptionView'
import JobAssigneesView from '../../../shared/components/job-detail/JobAssigneesView'
import JobAttachmentsField from '../../../shared/components/form-fields/JobAttachmentsField'
import JobCommentsView from '../../../shared/components/job-detail/JobCommentsView'
import CountdownTimer from '../../../shared/components/ui/countdown-timer'

export const Route = createFileRoute('/_workspace/jobs/$no')({
    head: (ctx) => {
        // Correctly type the loader data based on ApiResponse
        const response = ctx.loaderData as unknown as ApiResponse<TJob>
        return {
            meta: [
                { title: getPageTitle(response?.result?.displayName ?? 'Job') },
            ],
        }
    },
    loader({ context, params }) {
        return context.queryClient.ensureQueryData({
            ...jobByNoOptions(params.no),
        })
    },
    component: JobDetailPage,
})

function JobDetailPage() {
    const { no } = Route.useParams()

    // 1. Fetch Data
    const { data: job, isFetching: isLoading } = useSuspenseQuery({
        ...jobByNoOptions(no),
    })

    const {
        data: activityLogs,
        refetch,
        isFetching: isActivityLogLoading,
    } = useQuery({
        // If nextStatusOrder is null/undefined, pass -1 (or 0) to satisfy TS.
        // The query won't run because of 'enabled' below.
        ...jobActivityLogsOptions(job?.id ?? ''),

        // Only fetch if nextStatusOrder exists
        enabled: !!job?.id,
    })

    const isJobCompleted = job?.completedAt !== null

    if (!job) return null

    const updateAttachmentMutation = useUpdateJobMutation((res) => {
        addToast({
            title: 'Attachments updated',
            description: `The attachments for job ${res.result?.no} have been updated.`,
            color: 'success',
        })
    })

    const removeAttachmentMutation = useUpdateJobMutation((res) => {
        addToast({
            title: 'Attachment removed',
            description: `The attachment for job ${res.result?.no} has been removed.`,
            color: 'success',
            icon: <Trash2 />,
        })
    })

    const handleAddAttachment = (attachments: string[]) =>
        updateAttachmentMutation.mutate({
            jobId: job.id,
            data: {
                attachmentUrls: attachments,
            },
        })
    const handleRemoveAttachment = (attachments: string[]) =>
        removeAttachmentMutation.mutate({
            jobId: job.id,
            data: {
                attachmentUrls: attachments,
            },
        })

    return (
        <div className="size-full">
            {/* --- Header / Breadcrumbs Area --- */}
            <div className="py-4 px-4 flex items-start justify-between">
                <div className="space-y-3">
                    <HeroBreadcrumbs className="text-xs">
                        <HeroBreadcrumbItem>
                            <Link
                                to={INTERNAL_URLS.home}
                                className="text-text-subdued"
                            >
                                <House size={16} />
                            </Link>
                        </HeroBreadcrumbItem>
                        <HeroBreadcrumbItem>
                            <Link
                                to={INTERNAL_URLS.projectCenter}
                                className="text-text-subdued"
                            >
                                Jobs
                            </Link>
                        </HeroBreadcrumbItem>
                        <HeroBreadcrumbItem>
                            <span className="font-medium">{job.no}</span>
                        </HeroBreadcrumbItem>
                    </HeroBreadcrumbs>

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
                                    {job.displayName || 'Untitled Job'}
                                </h1>
                                {job?.isPaid && (
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
                                                        job.isPaid
                                                            ? 'paid'
                                                            : 'unpaid'
                                                    ].hexColor,
                                            }}
                                        />
                                        {job.isPaid ? 'Paid' : 'Unpaid'}
                                    </Chip>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 text-small text-default-500">
                        <div className="flex items-center gap-1">
                            {isLoading ? (
                                <Skeleton className="w-24 h-6 rounded-md" />
                            ) : (
                                <>
                                    <UserRound size={16} />
                                    <span>{job.clientName}</span>
                                </>
                            )}
                        </div>
                        <Divider
                            orientation="vertical"
                            className="h-4 self-center"
                        />
                        <div className="flex items-center gap-1">
                            {isLoading ? (
                                <Skeleton className="w-24 h-6 rounded-md" />
                            ) : (
                                <>
                                    <LibraryBig size={16} />
                                    <span>{job.type?.code} - </span>
                                    <span>{job.type?.displayName}</span>
                                </>
                            )}
                        </div>
                        <Divider
                            orientation="vertical"
                            className="h-4 self-center"
                        />

                        {/* DUE ON */}
                        <div className="flex items-center gap-1">
                            {isLoading ? (
                                <Skeleton className="w-56 h-6 rounded-md" />
                            ) : (
                                <>
                                    <CalendarDays size={16} />
                                    <div className="flex items-center justify-start gap-2">
                                        <p>
                                            {isJobCompleted
                                                ? 'Completed at: '
                                                : 'Due on: '}
                                        </p>
                                        <div className="text-text-default">
                                            {isJobCompleted ? (
                                                dateFormatter(
                                                    job?.completedAt as
                                                        | string
                                                        | Date,
                                                    { format: 'full' }
                                                )
                                            ) : (
                                                <CountdownTimer
                                                    targetDate={dayjs(
                                                        job.dueAt
                                                    )}
                                                    mode="text"
                                                    hiddenUnits={['second']}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <Timmer />
            </div>

            <Divider />

            {/* --- Main Grid Layout --- */}
            <ScrollArea className="w-full h-[calc(100vh-195px)]">
                <ScrollBar orientation="horizontal" />
                <ScrollBar orientation="vertical" />
                <div className="size-full px-4 py-2 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
                    {/* LEFT COLUMN - Main Content (2/3 width) */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <Tabs
                            aria-label="Job Details"
                            variant="underlined"
                            color="primary"
                        >
                            {/* TAB: OVERVIEW */}
                            <Tab
                                key="overview"
                                title={
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} />
                                        <span>Overview</span>
                                    </div>
                                }
                            >
                                <ScrollArea className="size-full h-full!">
                                    <ScrollBar orientation="vertical" />
                                    <JobDescriptionView job={job} />
                                    <Spacer className="h-4" />
                                    <JobAssigneesView
                                        jobId={job.id}
                                        jobNo={job.no}
                                    />

                                    <Divider className="my-5" />

                                    <HeroCard className="bg-background p-0!">
                                        <HeroCardHeader className="flex items-center justify-between bg-background-muted">
                                            <span className="text-small font-bold text-default-600 uppercase tracking-wider">
                                                Activity logs
                                            </span>
                                            <HeroButton
                                                startContent={
                                                    <RotateCcw
                                                        className="text-small"
                                                        size={14}
                                                    />
                                                }
                                                variant="bordered"
                                                size="sm"
                                                className="hover:shadow-SM border-border-default border-1"
                                                color="default"
                                                onPress={refetch}
                                            >
                                                <span className="font-medium">
                                                    Refresh
                                                </span>
                                            </HeroButton>
                                        </HeroCardHeader>
                                        <HeroCardBody>
                                            <JobActivityHistory
                                                logs={activityLogs}
                                                isLoading={isActivityLogLoading}
                                            />
                                        </HeroCardBody>
                                    </HeroCard>
                                </ScrollArea>
                            </Tab>

                            {/* TAB: ATTACHMENTS */}
                            <Tab
                                key="attachments"
                                title={
                                    <div className="flex items-center gap-2">
                                        <LinkIcon size={16} />
                                        <span>Attachments</span>
                                        <Chip size="sm" variant="flat">
                                            {job.attachmentUrls?.length}
                                        </Chip>
                                    </div>
                                }
                            >
                                <JobAttachmentsField
                                    defaultAttachments={job.attachmentUrls}
                                    onChange={handleAddAttachment}
                                    onRemove={handleRemoveAttachment}
                                />
                            </Tab>

                            {/* TAB: COMMENTS */}
                            <Tab
                                key="comments"
                                title={
                                    <div className="flex items-center gap-2">
                                        <MessageSquare size={16} />
                                        <span>Comments</span>
                                        <Chip size="sm" variant="flat">
                                            {job.comments?.length}
                                        </Chip>
                                    </div>
                                }
                            >
                                <ScrollArea className="size-full h-full!">
                                    <ScrollBar orientation="vertical" />
                                    <ScrollBar orientation="horizontal" />
                                    <JobCommentsView job={job} />
                                </ScrollArea>
                            </Tab>

                            <Tab key="discussion" title="Discussion">
                                <div className="flex flex-col h-100">
                                    <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                                        {/* Message 1 */}
                                        <div className="flex gap-3">
                                            <Avatar
                                                src="https://i.pravatar.cc/150?u=david"
                                                size="sm"
                                            />
                                            <div className="bg-slate-100 p-3 rounded-xl rounded-tl-none">
                                                <p className="text-xs font-bold text-slate-700 mb-1">
                                                    David Chen
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    Please check the new assets
                                                    I uploaded. They match the
                                                    Figma file.
                                                </p>
                                                <span className="text-[10px] text-slate-400 mt-1 block">
                                                    2 hours ago
                                                </span>
                                            </div>
                                        </div>
                                        {/* Message 2 (Me) */}
                                        <div className="flex gap-3 flex-row-reverse">
                                            <Avatar
                                                src="https://i.pravatar.cc/150?u=me"
                                                size="sm"
                                            />
                                            <div className="bg-primary-50 p-3 rounded-xl rounded-tr-none">
                                                <p className="text-xs font-bold text-primary mb-1 text-right">
                                                    You
                                                </p>
                                                <p className="text-sm text-slate-700">
                                                    Got it. I will start
                                                    implementing the checkout
                                                    flow now.
                                                </p>
                                                <span className="text-[10px] text-primary/60 mt-1 block text-right">
                                                    Just now
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-border-default">
                                        <Textarea
                                            placeholder="Type your message..."
                                            minRows={2}
                                            variant="bordered"
                                            className="mb-2"
                                        />
                                        <div className="flex justify-between items-center">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                            >
                                                <Paperclip size={16} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                color="primary"
                                                endContent={<Send size={14} />}
                                            >
                                                Send
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>

                    {/* RIGHT COLUMN - Sidebar Metadata (1/3 width) */}
                    <div className="py-4 flex flex-col gap-4">
                        {/* General Info Card */}
                        <HeroCard
                            className="border border-default-200 p-0!"
                            shadow="none"
                        >
                            <HeroCardHeader className="bg-default-100/50 pb-2">
                                <span className="text-small font-bold text-default-600 uppercase tracking-wider">
                                    Details
                                </span>
                            </HeroCardHeader>
                            <CardBody className="space-y-4">
                                <InfoRow
                                    icon={<Briefcase size={16} />}
                                    label="Type"
                                >
                                    <span className="text-small font-medium">
                                        {job.type?.displayName}
                                    </span>
                                </InfoRow>

                                <InfoRow
                                    icon={<Flag size={16} />}
                                    label="Priority"
                                >
                                    <PriorityChip priority={job.priority} />
                                </InfoRow>

                                <InfoRow
                                    icon={<Banknote size={16} />}
                                    label="Payment Channel"
                                >
                                    <div className="flex items-center gap-2">
                                        {job.paymentChannel?.logoUrl && (
                                            <Avatar
                                                src={job.paymentChannel.logoUrl}
                                                size="sm"
                                                className="w-5 h-5"
                                            />
                                        )}
                                        <span className="text-small font-medium">
                                            {job.paymentChannel?.displayName ||
                                                'N/A'}
                                        </span>
                                    </div>
                                </InfoRow>

                                <Divider className="my-2" />
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-tiny text-default-500">
                                            Income
                                        </p>
                                        <p className="font-semibold text-success-600">
                                            {formatCurrencyVND(job.incomeCost)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-tiny text-default-500">
                                            Staff Cost
                                        </p>
                                        <p className="font-semibold text-danger-600">
                                            {formatCurrencyVND(job.staffCost)}
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </HeroCard>

                        {/* Dates Card */}
                        <HeroCard
                            className="border border-default-200 p-0!"
                            shadow="none"
                        >
                            <HeroCardHeader className="bg-background-muted pb-2">
                                <span className="text-small font-bold text-default-600 uppercase tracking-wider">
                                    Timeline
                                </span>
                            </HeroCardHeader>
                            <CardBody className="space-y-4">
                                <DateRow
                                    label="Start Date"
                                    date={job.startedAt}
                                />
                                <DateRow
                                    label="Due Date"
                                    date={job.dueAt}
                                    highlight
                                />
                                {job.completedAt && (
                                    <DateRow
                                        label="Completed"
                                        date={job.completedAt}
                                    />
                                )}
                                <Divider />
                                <DateRow
                                    label="Created"
                                    date={job.createdAt}
                                    isSecondary
                                />
                                <DateRow
                                    label="Last Updated"
                                    date={job.updatedAt}
                                    isSecondary
                                />
                            </CardBody>
                        </HeroCard>

                        {/* People Card */}
                        <HeroCard className="shadow-sm border border-slate-200 bg-slate-900 text-white">
                            <HeroCardBody className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1 bg-white/10 rounded">
                                        <CirclePlus size={16} />
                                    </div>
                                    <span className="font-bold text-sm">
                                        Created by
                                    </span>
                                </div>
                                <div className="py-2 flex items-center justify-start gap-3">
                                    <Avatar
                                        src={optimizeCloudinary(
                                            job.createdBy.avatar,
                                            {
                                                width: 256,
                                                height: 256,
                                            }
                                        )}
                                        className="ring-text-7 ring-1 ring-offset-1"
                                    />
                                    <div>
                                        <p>{job.createdBy.displayName}</p>{' '}
                                        <p className="text-[10px]">
                                            {dateFormatter(job.createdAt, {
                                                format: 'fullShort',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </HeroCardBody>
                        </HeroCard>

                        <HeroCard className="shadow-sm border border-slate-200 bg-slate-900 text-white">
                            <HeroCardBody className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1 bg-white/10 rounded">
                                        <LinkIcon size={16} />
                                    </div>
                                    <span className="font-bold text-sm">
                                        Link
                                    </span>
                                </div>
                                <Snippet
                                    symbol=""
                                    size="sm"
                                    className="bg-black/30 text-slate-300 w-full mb-2"
                                >
                                    {EXTERNAL_URLS.getJobDetailUrl(job.no)}
                                </Snippet>
                                <p className="text-[10px] text-slate-400">
                                    This link only can be share for team member.
                                </p>
                            </HeroCardBody>
                        </HeroCard>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

// --- Helper Components ---

const InfoRow = ({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode
    label: string
    children: React.ReactNode
}) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-default-500">
            {icon}
            <span className="text-small">{label}</span>
        </div>
        <div>{children}</div>
    </div>
)

const DateRow = ({
    label,
    date,
    highlight = false,
    isSecondary = false,
}: {
    label: string
    date: string | Date
    highlight?: boolean
    isSecondary?: boolean
}) => (
    <div className="flex justify-between items-center">
        <span
            className={`text-small ${isSecondary ? 'text-default-400' : 'text-default-600'}`}
        >
            {label}
        </span>
        <span
            className={`text-small font-medium ${highlight ? 'text-danger' : 'text-text-default'} ${isSecondary ? 'text-default-400' : ''}`}
        >
            {date ? dayjs(date).format('MMM DD, YYYY') : '--'}
        </span>
    </div>
)

const PriorityChip = ({ priority }: { priority: string }) => {
    const colorMap: Record<
        string,
        'success' | 'warning' | 'danger' | 'default' | 'primary' | 'secondary'
    > = {
        LOW: 'success',
        MEDIUM: 'warning',
        HIGH: 'danger',
        URGENT: 'danger',
    }

    return (
        <Chip
            color={colorMap[priority] || 'default'}
            variant="flat"
            size="sm"
            className="capitalize"
        >
            {priority?.toLowerCase()}
        </Chip>
    )
}
