import {
    addToast,
    Avatar,
    Button,
    Chip,
    Divider,
    Progress,
    Snippet,
    Spinner,
    Tab,
    Tabs,
    useDisclosure,
} from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import lodash from 'lodash'
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    CirclePlus,
    Clock,
    FileText,
    LibraryBig,
    LinkIcon,
    Maximize2,
    MessageSquare,
    Pencil,
    RotateCcw,
    SquareArrowOutUpRight,
    UserRound,
    Users,
    Wallet,
    TrendingDown,
    ChevronRight,
} from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'

import { dateFormatter } from '@/lib/dayjs'
import {
    jobActivityLogsOptions,
    jobByNoOptions,
    useProfile,
    useUpdateJobMutation,
} from '@/lib/queries'
import { currencyFormatter, EXTERNAL_URLS, INTERNAL_URLS } from '@/lib/utils'

import { JobStatusSystemTypeEnum } from '../../enums'
import JobAttachmentsField from '../form-fields/JobAttachmentsField'
import { JobStatusChip } from '../chips/JobStatusChip'
import { PaidChip } from '../chips/PaidChip'
import { DeliverJobModal } from '../modals/DeliverJobModal'
import UpdateProjectFinancialModal from '../project-center/UpdateCostModal'
import CountdownTimer from '../ui/countdown-timer'
import { HeroButton } from '../ui/hero-button'
import HeroCopyButton from '../ui/hero-copy-button'
import {
    HeroDrawer,
    HeroDrawerBody,
    HeroDrawerContent,
    HeroDrawerHeader,
} from '../ui/hero-drawer'
import { HeroCard, HeroCardBody, HeroCardHeader } from '../ui/hero-card'
import HtmlReactParser from '../ui/html-react-parser'
import { JobActivityHistory } from './JobActivityHistory'
import JobAssigneesView from './JobAssigneesView'
import JobCommentsView from './JobCommentsView'
import JobDescriptionModal from './JobDescriptionModal'
import QuillEditor from '../editor-quill/QuillEditor'

type Props = {
    isOpen: boolean
    onClose: () => void
    jobNo: string
}

export default function JobDetailDrawer({ jobNo, isOpen, onClose }: Props) {
    // 1. TOP-LEVEL HOOKS
    const { isAdmin } = useProfile()
    const deliverJobDisclosure = useDisclosure()
    const financialModal = useDisclosure()
    const fullEditorDisclosure = useDisclosure()

    const { data: job, isLoading: loadingJob } = useQuery({
        ...jobByNoOptions(jobNo),
        enabled: !!jobNo && isOpen,
    })

    const {
        data: activityLogs,
        refetch: refetchLogs,
        isFetching: isLogsLoading,
    } = useQuery({
        ...jobActivityLogsOptions(job?.id ?? ''),
        enabled: !!job?.id,
    })

    const updateJobMutation = useUpdateJobMutation(() => {
        addToast({ title: 'Success', color: 'success' })
    })

    const [isEditable, setIsEditable] = useState(false)
    const [descContent, setDescContent] = useState('')

    useEffect(() => {
        if (job?.description) setDescContent(job.description)
    }, [job?.description])

    // 2. DERIVED LOGIC
    const isLoading = lodash.isEmpty(job) || loadingJob
    const profit = useMemo(
        () => (job?.incomeCost || 0) - (job?.totalStaffCost || 0),
        [job]
    )
    const isJobCompleted =
        job?.status?.systemType === JobStatusSystemTypeEnum.COMPLETED
    const budgetUsage = useMemo(() => {
        if (!job?.incomeCost || job.incomeCost === 0) return 0
        return Math.min(
            Math.round(((job.totalStaffCost || 0) / job.incomeCost) * 100),
            100
        )
    }, [job])

    const handleSaveDescription = async (content?: string) => {
        const finalContent = content ?? descContent
        if (!job?.id) return
        await updateJobMutation.mutateAsync({
            jobId: job.id,
            data: { description: finalContent },
        })
        setIsEditable(false)
    }

    return (
        <>
            {/* MODALS */}
            {deliverJobDisclosure.isOpen && job && (
                <DeliverJobModal
                    isOpen={deliverJobDisclosure.isOpen}
                    onClose={deliverJobDisclosure.onClose}
                    defaultJob={job.id}
                />
            )}
            {financialModal.isOpen && job && (
                <UpdateProjectFinancialModal
                    data={job}
                    isOpen={financialModal.isOpen}
                    onClose={financialModal.onClose}
                />
            )}
            {fullEditorDisclosure.isOpen && job && (
                <JobDescriptionModal
                    isOpen={fullEditorDisclosure.isOpen}
                    onClose={fullEditorDisclosure.onClose}
                    value={descContent}
                    onChange={setDescContent}
                    // onSave={() => handleSaveDescription(descContent)}
                    title={`Editor: #${job.no}`}
                />
            )}

            <HeroDrawer isOpen={Boolean(jobNo) && isOpen} onClose={onClose}>
                <HeroDrawerContent className="min-w-[calc(100vw-16px)] lg:min-w-0 lg:max-w-225 xl:max-w-225">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <Spinner
                                size="lg"
                                label="Syncing project data..."
                            />
                        </div>
                    ) : (
                        <>
                            {/* HEADER */}
                            <HeroDrawerHeader className="flex flex-col gap-2">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                        <span className="text-small font-semibold tracking-wider font-mono">
                                            #{job.no}
                                        </span>
                                        <HeroCopyButton textValue={job.no} />
                                        <JobStatusChip data={job.status} />
                                        <PaidChip
                                            status={
                                                job.isPaid ? 'paid' : 'unpaid'
                                            }
                                        />
                                    </div>
                                    <HeroButton
                                        startContent={
                                            <SquareArrowOutUpRight size={14} />
                                        }
                                        variant="ghost"
                                        size="sm"
                                        onPress={() =>
                                            window.open(
                                                INTERNAL_URLS.getJobDetailUrl(
                                                    job.no
                                                ),
                                                '_blank'
                                            )
                                        }
                                    >
                                        Open detail
                                    </HeroButton>
                                </div>
                                <h1 className="text-2xl font-bold mt-2">
                                    {job.displayName}
                                </h1>
                                <div className="flex gap-4 text-tiny text-default-500 items-center">
                                    <span className="flex items-center gap-1">
                                        <UserRound size={14} /> {job.clientName}
                                    </span>
                                    <Divider
                                        orientation="vertical"
                                        className="h-3"
                                    />
                                    <span className="flex items-center gap-1">
                                        <LibraryBig size={14} />{' '}
                                        {job.type?.displayName}
                                    </span>
                                    <Divider
                                        orientation="vertical"
                                        className="h-3"
                                    />
                                    <span className="flex items-center gap-1 text-primary">
                                        <CalendarDays size={14} />
                                        {isJobCompleted ? (
                                            `Finished: ${dateFormatter(job.completedAt, { format: 'full' })}`
                                        ) : (
                                            <CountdownTimer
                                                targetDate={dayjs(job.dueAt)}
                                                mode="text"
                                                hiddenUnits={['second']}
                                            />
                                        )}
                                    </span>
                                </div>
                            </HeroDrawerHeader>

                            <Divider />

                            <HeroDrawerBody className="py-6">
                                <div className="flex flex-col gap-6">
                                    {/* ACTION BAR */}
                                    <div className="flex items-center justify-between p-3 bg-default-50 rounded-2xl border border-divider">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                color="primary"
                                                className="font-bold"
                                                startContent={
                                                    <CheckCircle2 size={16} />
                                                }
                                                onPress={
                                                    deliverJobDisclosure.onOpen
                                                }
                                            >
                                                Deliver Work
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                color="danger"
                                                startContent={
                                                    <AlertCircle size={16} />
                                                }
                                            >
                                                Issue
                                            </Button>
                                        </div>
                                        <div className="px-4 border-l border-divider text-right">
                                            <p className="text-[10px] font-black text-default-400 uppercase">
                                                Logged Time
                                            </p>
                                            <p className="text-xs font-bold flex items-center gap-1">
                                                <Clock size={12} /> 0h 0m
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2">
                                            <Tabs
                                                variant="underlined"
                                                color="primary"
                                                fullWidth
                                                classNames={{
                                                    tab: 'font-bold',
                                                }}
                                            >
                                                {/* TAB 1: OVERVIEW */}
                                                <Tab
                                                    key="overview"
                                                    title={
                                                        <div className="flex items-center gap-2">
                                                            <FileText
                                                                size={16}
                                                            />
                                                            <span>
                                                                Overview
                                                            </span>
                                                        </div>
                                                    }
                                                >
                                                    <div className="space-y-6 pt-4">
                                                        <HeroCard className="p-0! overflow-hidden border-divider shadow-none">
                                                            <HeroCardHeader className="justify-between bg-default-50/50 py-2">
                                                                <span className="text-xs font-bold uppercase tracking-widest text-default-500 px-2">
                                                                    Description
                                                                </span>
                                                                <div className="flex gap-1">
                                                                    <HeroButton
                                                                        isIconOnly
                                                                        size="sm"
                                                                        variant="light"
                                                                        onPress={
                                                                            fullEditorDisclosure.onOpen
                                                                        }
                                                                    >
                                                                        <Maximize2
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </HeroButton>
                                                                    <HeroButton
                                                                        isIconOnly
                                                                        size="sm"
                                                                        variant="light"
                                                                        onPress={() =>
                                                                            setIsEditable(
                                                                                !isEditable
                                                                            )
                                                                        }
                                                                    >
                                                                        <Pencil
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </HeroButton>
                                                                </div>
                                                            </HeroCardHeader>
                                                            <HeroCardBody className="p-4">
                                                                {isEditable ? (
                                                                    <div className="space-y-3">
                                                                        <QuillEditor
                                                                            value={
                                                                                descContent
                                                                            }
                                                                            onChange={
                                                                                setDescContent
                                                                            }
                                                                        />
                                                                        <div className="flex justify-end gap-2">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="flat"
                                                                                onPress={() =>
                                                                                    setIsEditable(
                                                                                        false
                                                                                    )
                                                                                }
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                color="primary"
                                                                                onPress={() =>
                                                                                    handleSaveDescription()
                                                                                }
                                                                            >
                                                                                Save
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ) : job.description ? (
                                                                    <HtmlReactParser
                                                                        htmlString={
                                                                            job.description
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <p className="text-default-400 italic text-center py-4">
                                                                        No
                                                                        description
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </HeroCardBody>
                                                        </HeroCard>

                                                        <JobAssigneesView
                                                            jobId={job.id}
                                                            jobNo={job.no}
                                                        />

                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <h3 className="text-xs font-black uppercase tracking-widest text-default-500">
                                                                    Activity
                                                                    History
                                                                </h3>
                                                                <Button
                                                                    size="sm"
                                                                    variant="light"
                                                                    isIconOnly
                                                                    onPress={() =>
                                                                        refetchLogs()
                                                                    }
                                                                    isLoading={
                                                                        isLogsLoading
                                                                    }
                                                                >
                                                                    <RotateCcw
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </Button>
                                                            </div>
                                                            <JobActivityHistory
                                                                logs={
                                                                    activityLogs
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </Tab>

                                                {/* TAB 2: ATTACHMENTS */}
                                                <Tab
                                                    key="attachments"
                                                    title={
                                                        <div className="flex items-center gap-2">
                                                            <LinkIcon
                                                                size={16}
                                                            />
                                                            <span>
                                                                Attachments
                                                            </span>
                                                            <Chip
                                                                size="sm"
                                                                variant="flat"
                                                            >
                                                                {job
                                                                    .attachmentUrls
                                                                    ?.length ||
                                                                    0}
                                                            </Chip>
                                                        </div>
                                                    }
                                                >
                                                    <div className="pt-4">
                                                        <JobAttachmentsField
                                                            defaultAttachments={
                                                                job.attachmentUrls
                                                            }
                                                            onChange={(urls) =>
                                                                updateJobMutation.mutate(
                                                                    {
                                                                        jobId: job.id,
                                                                        data: {
                                                                            attachmentUrls:
                                                                                urls,
                                                                        },
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </Tab>

                                                {/* TAB 3: ASSIGNMENTS (Beautiful Version) */}
                                                <Tab
                                                    key="assignments"
                                                    title={
                                                        <div className="flex items-center gap-2">
                                                            <Users size={16} />
                                                            <span>
                                                                Assignments
                                                            </span>
                                                        </div>
                                                    }
                                                >
                                                    <div className="flex flex-col gap-6 py-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <HeroCard className="bg-primary/5 border-primary/20 shadow-none">
                                                                <HeroCardBody className="flex-row items-center gap-4 p-4">
                                                                    <div className="p-2.5 bg-primary rounded-xl text-white">
                                                                        <Wallet
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-col flex-1">
                                                                        <span className="text-[10px] uppercase font-black text-primary/60">
                                                                            Total
                                                                            Staff
                                                                            Payout
                                                                        </span>
                                                                        <span className="text-xl font-black text-primary">
                                                                            {currencyFormatter(
                                                                                job.totalStaffCost ||
                                                                                    0
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    {isAdmin && (
                                                                        <Button
                                                                            size="sm"
                                                                            color="primary"
                                                                            variant="flat"
                                                                            onPress={
                                                                                financialModal.onOpen
                                                                            }
                                                                        >
                                                                            <Pencil
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                        </Button>
                                                                    )}
                                                                </HeroCardBody>
                                                            </HeroCard>
                                                            <HeroCard className="bg-default-50 border-divider shadow-none">
                                                                <HeroCardBody className="p-4 gap-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-[10px] uppercase font-black text-default-400">
                                                                            Budget
                                                                            Usage
                                                                        </span>
                                                                        <span className="text-xs font-bold">
                                                                            {
                                                                                budgetUsage
                                                                            }
                                                                            %
                                                                        </span>
                                                                    </div>
                                                                    <Progress
                                                                        size="sm"
                                                                        value={
                                                                            budgetUsage
                                                                        }
                                                                        color={
                                                                            budgetUsage >
                                                                            80
                                                                                ? 'danger'
                                                                                : 'primary'
                                                                        }
                                                                    />
                                                                </HeroCardBody>
                                                            </HeroCard>
                                                        </div>

                                                        <div className="space-y-2">
                                                            {job.assignments?.map(
                                                                (asgn) => (
                                                                    <div
                                                                        key={
                                                                            asgn.id
                                                                        }
                                                                        className="group flex items-center justify-between p-3 bg-background hover:bg-default-50 rounded-2xl border border-divider transition-all"
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <Avatar
                                                                                src={
                                                                                    asgn
                                                                                        .user
                                                                                        .avatar
                                                                                }
                                                                                size="sm"
                                                                                isBordered
                                                                                color="primary"
                                                                            />
                                                                            <div className="flex flex-col">
                                                                                <span className="text-sm font-bold">
                                                                                    {
                                                                                        asgn
                                                                                            .user
                                                                                            .displayName
                                                                                    }
                                                                                </span>
                                                                                <span className="text-[10px] uppercase text-default-400 font-bold">
                                                                                    Partner
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="text-right">
                                                                                <p className="text-[10px] uppercase font-bold text-default-400">
                                                                                    Payout
                                                                                </p>
                                                                                <p className="text-sm font-black text-primary">
                                                                                    {isAdmin
                                                                                        ? currencyFormatter(
                                                                                              asgn.staffCost ||
                                                                                                  0
                                                                                          )
                                                                                        : '••••••'}
                                                                                </p>
                                                                            </div>
                                                                            <ChevronRight
                                                                                size={
                                                                                    16
                                                                                }
                                                                                className="text-default-300 group-hover:text-primary transition-all"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                        <div className="p-4 rounded-2xl bg-warning-50 border border-warning-100 flex gap-3 items-start">
                                                            <TrendingDown
                                                                className="text-warning-500 shrink-0 mt-0.5"
                                                                size={16}
                                                            />
                                                            <p className="text-tiny text-warning-700">
                                                                Staff costs are
                                                                deducted from
                                                                income. Ensure
                                                                accuracy before
                                                                marking as paid.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Tab>

                                                {/* TAB 4: COMMENTS */}
                                                <Tab
                                                    key="comments"
                                                    title={
                                                        <div className="flex items-center gap-2">
                                                            <MessageSquare
                                                                size={16}
                                                            />
                                                            <span>
                                                                Comments
                                                            </span>
                                                            <Chip
                                                                size="sm"
                                                                variant="flat"
                                                            >
                                                                {job.comments
                                                                    ?.length ||
                                                                    0}
                                                            </Chip>
                                                        </div>
                                                    }
                                                >
                                                    <div className="pt-4">
                                                        <JobCommentsView
                                                            job={job}
                                                        />
                                                    </div>
                                                </Tab>
                                            </Tabs>
                                        </div>

                                        {/* SIDEBAR */}
                                        <div className="space-y-4">
                                            <HeroCard className="border-divider shadow-none">
                                                <HeroCardHeader className="justify-between py-2 border-b border-divider">
                                                    <span className="text-xs font-black uppercase tracking-widest text-default-400">
                                                        Financials
                                                    </span>
                                                    {isAdmin && (
                                                        <HeroButton
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            onPress={
                                                                financialModal.onOpen
                                                            }
                                                        >
                                                            <Pencil size={12} />
                                                        </HeroButton>
                                                    )}
                                                </HeroCardHeader>
                                                <HeroCardBody className="text-sm space-y-3 pt-3">
                                                    {isAdmin && (
                                                        <div className="flex justify-between">
                                                            <span>Income</span>
                                                            <span className="font-bold text-foreground">
                                                                {currencyFormatter(
                                                                    job.incomeCost
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between text-primary">
                                                        <span>
                                                            Total Payout
                                                        </span>
                                                        <span className="font-black">
                                                            {currencyFormatter(
                                                                job.totalStaffCost ||
                                                                    job.staffCost
                                                            )}
                                                        </span>
                                                    </div>
                                                    <Divider />
                                                    <div className="flex justify-between text-[10px] opacity-60 uppercase font-bold tracking-tighter">
                                                        <span>Account</span>
                                                        <span>
                                                            {job.paymentChannel
                                                                ?.displayName ||
                                                                '-'}
                                                        </span>
                                                    </div>
                                                </HeroCardBody>
                                            </HeroCard>

                                            <HeroCard className="bg-zinc-900 text-white border-none p-4 gap-4 shadow-none">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40">
                                                    <CirclePlus size={14} />{' '}
                                                    Metadata
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        src={
                                                            job.createdBy.avatar
                                                        }
                                                        size="sm"
                                                        className="ring-1 ring-white/20"
                                                    />
                                                    <div>
                                                        <p className="text-xs font-bold">
                                                            {
                                                                job.createdBy
                                                                    .displayName
                                                            }
                                                        </p>
                                                        <p className="text-[10px] opacity-40">
                                                            {dateFormatter(
                                                                job.createdAt,
                                                                {
                                                                    format: 'fullShort',
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </HeroCard>

                                            <HeroCard className="bg-zinc-900 text-white border-none p-4 text-center space-y-3 shadow-none overflow-hidden">
                                                <span className="text-[10px] font-black uppercase opacity-40 flex items-center justify-center gap-1">
                                                    <LinkIcon size={14} />{' '}
                                                    Project Link
                                                </span>
                                                <Snippet
                                                    symbol=""
                                                    size="sm"
                                                    variant="flat"
                                                    className="bg-white/5 text-white w-full overflow-hidden text-xs"
                                                >
                                                    {EXTERNAL_URLS.getJobDetailUrl(
                                                        job.no
                                                    )}
                                                </Snippet>
                                            </HeroCard>
                                        </div>
                                    </div>
                                </div>
                            </HeroDrawerBody>
                        </>
                    )}
                </HeroDrawerContent>
            </HeroDrawer>
        </>
    )
}
