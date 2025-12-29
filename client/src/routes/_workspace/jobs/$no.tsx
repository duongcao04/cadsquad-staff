import {
    addToast,
    Avatar,
    Button,
    Chip,
    Divider,
    Progress,
    Skeleton,
    Snippet,
    Spacer,
    Tab,
    Tabs,
    useDisclosure,
} from '@heroui/react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import {
    Banknote,
    Briefcase,
    CalendarDays,
    ChevronLeft,
    CircleDollarSign,
    CirclePlus,
    FileText,
    Flag,
    House,
    LibraryBig,
    LinkIcon,
    Maximize2,
    MessageSquare,
    Pencil,
    RotateCcw,
    Trash2,
    UserRound,
    Users,
    Wallet,
    TrendingDown,
    Calculator,
    ChevronRight,
} from 'lucide-react'
import React, { useMemo, useState, useEffect } from 'react'

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
    useProfile,
} from '@/lib'
import { jobActivityLogsOptions, jobByNoOptions } from '@/lib/queries'
import { TJob } from '@/shared/types'

import {
    HeroButton,
    HeroCard,
    HeroCardBody,
    HeroCardHeader,
    JobActivityHistory,
    ScrollArea,
    ScrollBar,
} from '../../../shared/components'
import JobAttachmentsField from '../../../shared/components/form-fields/JobAttachmentsField'
import JobAssigneesView from '../../../shared/components/job-detail/JobAssigneesView'
import JobCommentsView from '../../../shared/components/job-detail/JobCommentsView'
import JobDescriptionView from '../../../shared/components/job-detail/JobDescriptionView'
import CountdownTimer from '../../../shared/components/ui/countdown-timer'
import Timmer from '@/shared/components/layouts/PageHeading/Timmer'
import UpdateCostModal from '../../../shared/components/project-center/UpdateCostModal'

export const Route = createFileRoute('/_workspace/jobs/$no')({
    head: (ctx) => {
        const response = ctx.loaderData as unknown as ApiResponse<TJob>
        return {
            meta: [{ title: getPageTitle(response?.result?.displayName ?? 'Job') }],
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
    const { isAdmin } = useProfile()
    const financialModal = useDisclosure()

    // 1. Fetch Data
    const { data: job, isFetching: isLoading } = useSuspenseQuery({
        ...jobByNoOptions(no),
    })

    const {
        data: activityLogs,
        refetch,
        isFetching: isActivityLogLoading,
    } = useQuery({
        ...jobActivityLogsOptions(job?.id ?? ''),
        enabled: !!job?.id,
    })

    // 2. Mutations
    const updateAttachmentMutation = useUpdateJobMutation(() => {
        addToast({ title: 'Attachments updated', color: 'success' })
    })

    // 3. Derived Logic
    const isJobCompleted = job?.completedAt !== null
    const profit = useMemo(() => (job?.incomeCost || 0) - (job?.totalStaffCost || 0), [job])
    const budgetUsage = useMemo(() => {
        if (!job?.incomeCost || job.incomeCost === 0) return 0
        return Math.min(Math.round(((job.totalStaffCost || 0) / job.incomeCost) * 100), 100)
    }, [job])

    if (!job) return null

    return (
        <div className="size-full">
            {financialModal.isOpen && (
                <UpdateCostModal
                    data={job}
                    isOpen={financialModal.isOpen}
                    onClose={financialModal.onClose}
                />
            )}

            {/* --- Header Area --- */}
            <div className="py-4 px-4 flex items-start justify-between bg-background/50 backdrop-blur-md sticky top-0 z-10 border-b border-divider">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Link to={INTERNAL_URLS.projectCenter}>
                            <Button isIconOnly variant="light" size="sm"><ChevronLeft size={20} /></Button>
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight">{job.displayName}</h1>
                        <PaidChip status={job.isPaid ? 'paid' : 'unpaid'} />
                    </div>
                    <div className="flex gap-4 text-tiny text-default-500 items-center">
                        <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">#{job.no}</span>
                        <Divider orientation="vertical" className="h-3" />
                        <span className="flex items-center gap-1"><UserRound size={14} /> {job.clientName}</span>
                        <Divider orientation="vertical" className="h-3" />
                        <span className="flex items-center gap-1"><LibraryBig size={14} /> {job.type?.displayName}</span>
                    </div>
                </div>
                <Timmer />
            </div>

            {/* --- Main Content --- */}
            <ScrollArea className="w-full h-[calc(100vh-120px)]">
                <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                    
                    {/* LEFT COLUMN - 4 TABS */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <Tabs aria-label="Job Detail Tabs" variant="underlined" color="primary" classNames={{ tab: "font-bold" }}>
                            
                            {/* TAB 1: OVERVIEW */}
                            <Tab key="overview" title={<div className="flex items-center gap-2"><FileText size={16} /><span>Overview</span></div>}>
                                <div className="space-y-8 pt-4">
                                    {/* <JobDescriptionView job={job} /> */}
                                    <JobAssigneesView jobId={job.id} jobNo={job.no} />
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-default-400">Activity Timeline</h3>
                                            <HeroButton isIconOnly variant="light" size="sm" onPress={() => refetch()} isLoading={isActivityLogLoading}><RotateCcw size={14} /></HeroButton>
                                        </div>
                                        <JobActivityHistory logs={activityLogs} />
                                    </div>
                                </div>
                            </Tab>

                            {/* TAB 2: ATTACHMENTS */}
                            <Tab key="attachments" title={<div className="flex items-center gap-2"><LinkIcon size={16} /><span>Attachments</span><Chip size="sm" variant="flat">{job.attachmentUrls?.length || 0}</Chip></div>}>
                                <div className="pt-4">
                                    <JobAttachmentsField 
                                        defaultAttachments={job.attachmentUrls} 
                                        onChange={(urls) => updateAttachmentMutation.mutate({ jobId: job.id, data: { attachmentUrls: urls } })} 
                                    />
                                </div>
                            </Tab>

                            {/* TAB 3: ASSIGNMENTS (Beautiful Financial View) */}
                            <Tab key="assignments" title={<div className="flex items-center gap-2"><Users size={16} /><span>Assignments</span></div>}>
                                <div className="flex flex-col gap-6 py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <HeroCard className="bg-primary/5 border-primary/20 shadow-none">
                                            <HeroCardBody className="flex-row items-center gap-4 p-4">
                                                <div className="p-2.5 bg-primary rounded-xl text-white"><Wallet size={20} /></div>
                                                <div className="flex flex-col flex-1">
                                                    <span className="text-[10px] uppercase font-black text-primary/60">Total Payout</span>
                                                    <span className="text-xl font-black text-primary">{formatCurrencyVND(job.totalStaffCost || 0)}</span>
                                                </div>
                                                {isAdmin && <Button size="sm" color="primary" variant="flat" onPress={financialModal.onOpen}><Pencil size={14}/></Button>}
                                            </HeroCardBody>
                                        </HeroCard>
                                        <HeroCard className="bg-default-50 border-divider shadow-none">
                                            <HeroCardBody className="p-4 gap-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] uppercase font-black text-default-400">Budget Usage</span>
                                                    <span className="text-xs font-bold">{budgetUsage}%</span>
                                                </div>
                                                <Progress size="sm" value={budgetUsage} color={budgetUsage > 80 ? "danger" : "primary"} />
                                            </HeroCardBody>
                                        </HeroCard>
                                    </div>

                                    <div className="space-y-2">
                                        {job.assignments?.map((asgn) => (
                                            <div key={asgn.id} className="group flex items-center justify-between p-3 bg-background hover:bg-default-50 rounded-2xl border border-divider transition-all">
                                                <div className="flex items-center gap-3">
                                                    <Avatar src={asgn.user.avatar} size="sm" isBordered color="primary" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold">{asgn.user.displayName}</span>
                                                        <span className="text-[10px] uppercase text-default-400 font-bold">Project Partner</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-[10px] uppercase font-bold text-default-400">Payout</p>
                                                        <p className="text-sm font-black text-primary">{isAdmin ? formatCurrencyVND(asgn.staffCost || 0) : '••••••'}</p>
                                                    </div>
                                                    <ChevronRight size={16} className="text-default-300 group-hover:text-primary transition-all" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 rounded-2xl bg-warning-50 border border-warning-100 flex gap-3 items-start">
                                        <TrendingDown className="text-warning-500 shrink-0 mt-0.5" size={16} />
                                        <p className="text-tiny text-warning-700">Staff costs impact project margins. Verify accuracy before marking as paid.</p>
                                    </div>
                                </div>
                            </Tab>

                            {/* TAB 4: COMMENTS */}
                            <Tab key="comments" title={<div className="flex items-center gap-2"><MessageSquare size={16} /><span>Comments</span><Chip size="sm" variant="flat">{job.comments?.length || 0}</Chip></div>}>
                                <div className="pt-4"><JobCommentsView job={job} /></div>
                            </Tab>
                        </Tabs>
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="flex flex-col gap-6">
                        {/* Financial Card */}
                        <HeroCard className="border border-default-200 shadow-none">
                            <HeroCardHeader className="justify-between py-2 border-b border-divider">
                                <span className="text-xs font-black uppercase tracking-widest text-default-400">Financials</span>
                                {isAdmin && <HeroButton isIconOnly size="sm" variant="light" onPress={financialModal.onOpen}><Pencil size={12}/></HeroButton>}
                            </HeroCardHeader>
                            <HeroCardBody className="text-sm space-y-3 pt-3">
                                {isAdmin && <div className="flex justify-between text-default-500"><span>Income</span><span className="font-bold text-foreground">{formatCurrencyVND(job.incomeCost)}</span></div>}
                                <div className="flex justify-between text-primary"><span>Total Payout</span><span className="font-black">{formatCurrencyVND(job.totalStaffCost || job.staffCost)}</span></div>
                                <Divider />
                                <div className="flex justify-between text-[10px] opacity-60 uppercase font-bold"><span>Channel</span><span>{job.paymentChannel?.displayName || '-'}</span></div>
                            </HeroCardBody>
                        </HeroCard>

                        {/* Timeline Sidebar Card */}
                        <HeroCard className="border border-default-200 shadow-none">
                            <HeroCardHeader className="bg-default-50 pb-2"><span className="text-xs font-bold uppercase text-default-500">Project Timeline</span></HeroCardHeader>
                            <HeroCardBody className="space-y-4">
                                <DateRow label="Due Date" date={job.dueAt} highlight />
                                <DateRow label="Created" date={job.createdAt} isSecondary />
                                {job.completedAt && <DateRow label="Completed" date={job.completedAt} />}
                            </HeroCardBody>
                        </HeroCard>

                        {/* Metadata Card */}
                        <HeroCard className="bg-zinc-900 text-white border-none p-4 shadow-none">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40 mb-4"><CirclePlus size={14} /> Created By</div>
                            <div className="flex items-center gap-3">
                                <Avatar src={job.createdBy.avatar} size="sm" className="ring-1 ring-white/20" />
                                <div>
                                    <p className="text-xs font-bold">{job.createdBy.displayName}</p>
                                    <p className="text-[10px] opacity-40">{dateFormatter(job.createdAt, { format: 'fullShort' })}</p>
                                </div>
                            </div>
                        </HeroCard>

                        {/* Share Card */}
                        <HeroCard className="bg-zinc-900 text-white border-none p-5 text-center shadow-none overflow-hidden">
                            <span className="text-[10px] font-black uppercase opacity-40 flex items-center justify-center gap-1 mb-3"><LinkIcon size={14} /> Project Link</span>
                            <Snippet symbol="" size="sm" variant="flat" className="bg-white/5 text-white w-full overflow-hidden text-xs">{EXTERNAL_URLS.getJobDetailUrl(job.no)}</Snippet>
                        </HeroCard>
                    </div>
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </div>
    )
}

// --- Helper Components ---

const DateRow = ({ label, date, highlight = false, isSecondary = false }: { label: string; date: string | Date; highlight?: boolean; isSecondary?: boolean }) => (
    <div className="flex justify-between items-center">
        <span className={`text-tiny ${isSecondary ? 'text-default-400' : 'text-default-600 font-medium'}`}>{label}</span>
        <span className={`text-tiny font-bold ${highlight ? 'text-danger' : 'text-foreground'}`}>
            {date ? dayjs(date).format('MMM DD, YYYY') : '--'}
        </span>
    </div>
)

const PaidChip = ({ status }: { status: 'paid' | 'unpaid' }) => (
    <Chip
        size="sm"
        variant="flat"
        classNames={{ content: "flex items-center gap-2 font-bold" }}
    >
        <div 
            className="size-2 rounded-full" 
            style={{ backgroundColor: PAID_STATUS_COLOR[status].hexColor }} 
        />
        <span style={{ color: PAID_STATUS_COLOR[status].hexColor }}>{status.toUpperCase()}</span>
    </Chip>
)