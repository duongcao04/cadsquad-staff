import {
    addToast,
    Avatar,
    Button,
    Chip,
    Divider,
    Snippet,
    Spacer,
    Tab,
    Tabs,
    Textarea,
    useDisclosure,
} from '@heroui/react'
import {
    CircleDollarSign,
    CirclePlus,
    FileText,
    Link as IconLink,
    LinkIcon,
    MessageSquare,
    Paperclip,
    Pencil,
    RotateCcw,
    Send,
    Trash2,
} from 'lucide-react'

import { optimizeCloudinary } from '@/lib/cloudinary'
import { dateFormatter } from '@/lib/dayjs'
import {
    jobActivityLogsOptions,
    useProfile,
    useUpdateJobMutation,
} from '@/lib/queries'
import { currencyFormatter, EXTERNAL_URLS } from '@/lib/utils'
import type { TJob } from '@/shared/types'
import JobAttachmentsField from '../form-fields/JobAttachmentsField'
import UpdateCostModal from '../project-center/UpdateCostModal'
import { HeroButton } from '../ui/hero-button'
import { HeroCard, HeroCardBody, HeroCardHeader } from '../ui/hero-card'
import { HeroTooltip } from '../ui/hero-tooltip'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { JobActivityHistory } from './JobActivityHistory'
import JobAssigneesView from './JobAssigneesView'
import JobCommentsView from './JobCommentsView'
import JobDescriptionView from './JobDescriptionView'
import { useQuery } from '@tanstack/react-query'

interface JobDetailProps {
    data: TJob
    isLoading?: boolean
}
export const JobDetailView: React.FC<JobDetailProps> = ({ data: job }) => {
    const { isAdmin } = useProfile()

    const {
        data: activityLogs,
        refetch,
        isFetching: isActivityLogLoading,
    } = useQuery({
        // If nextStatusOrder is null/undefined, pass -1 (or 0) to satisfy TS.
        // The query won't run because of 'enabled' below.
        ...jobActivityLogsOptions(job.id ?? -1),

        // Only fetch if nextStatusOrder exists
        enabled: !!job.id,
    })

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

    const { isOpen, onClose, onOpen } = useDisclosure({ id: 'UpdateCostModal' })

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
        <>
            {isOpen && (
                <UpdateCostModal data={job} isOpen={isOpen} onClose={onClose} />
            )}
            <div className="w-full h-full flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN (Details & Tabs) */}
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

                                    <Divider className="mt-5" />

                                    <HeroCard className="shadow-none border-none px-0! py-0!">
                                        <HeroCardHeader className="flex items-center justify-between">
                                            <h3 className="text-sm uppercase">
                                                Activity logs
                                            </h3>
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
                                                onPress={refetch}
                                                color="default"
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
                                        <IconLink size={16} />
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

                    {/* RIGHT COLUMN (Sidebar Info) */}
                    <div className="flex flex-col gap-4">
                        {/* Financial Card */}
                        <HeroCard className="border border-default-200">
                            <HeroCardHeader className="justify-between py-1">
                                <div className="flex items-center justify-start gap-1.5">
                                    <CircleDollarSign size={16} />
                                    <h3 className="text-sm uppercase">Cost</h3>
                                </div>
                                {isAdmin && (
                                    <HeroTooltip content="Edit">
                                        <HeroButton
                                            isIconOnly
                                            className="size-8.5! aspect-square!"
                                            variant="light"
                                            onPress={onOpen}
                                        >
                                            <Pencil
                                                size={14}
                                                className="text-text-subdued"
                                            />
                                        </HeroButton>
                                    </HeroTooltip>
                                )}
                            </HeroCardHeader>
                            <HeroCardBody className="gap-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-text-subdued">
                                            Income
                                        </span>
                                        <span className="font-semibold text-currency">
                                            {currencyFormatter(job.incomeCost)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-text-subdued">
                                            Staff Cost
                                        </span>
                                        <span className="font-semibold text-currency">
                                            {currencyFormatter(
                                                job.staffCost,
                                                'Vietnamese'
                                            )}
                                        </span>
                                    </div>
                                    <Divider className="my-1" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-text-subdued">
                                            Payment channel
                                        </span>
                                        <div className="text-right">
                                            <span className="font-semibold text-currency">
                                                {job.paymentChannel.displayName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </HeroCardBody>
                        </HeroCard>

                        {/* Meta Info Card */}
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
            </div>
        </>
    )
}
