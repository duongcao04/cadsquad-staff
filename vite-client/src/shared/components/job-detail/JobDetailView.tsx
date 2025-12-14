import {
    addToast,
    Avatar,
    Chip,
    Divider,
    Spacer,
    Tab,
    Tabs,
    useDisclosure,
} from '@heroui/react'
import {
    CircleDollarSign,
    CirclePlus,
    FileText,
    Link as IconLink,
    MessageSquare,
    Pencil,
    Trash2,
} from 'lucide-react'


import { optimizeCloudinary } from '@/lib/cloudinary'
import { dateFormatter } from '@/lib/dayjs'
import { useProfile, useUpdateJobMutation } from '@/lib/queries'
import { currencyFormatter } from '@/lib/utils'
import type { TJob } from '@/shared/types'

import JobAttachmentsField from '../form-fields/JobAttachmentsField'
import UpdateCostModal from '../project-center/UpdateCostModal'
import { HeroButton } from '../ui/hero-button'
import { HeroCard, HeroCardBody, HeroCardHeader } from '../ui/hero-card'
import { HeroTooltip } from '../ui/hero-tooltip'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { JobActivityHistory } from './JobActivityLog'
import JobAssigneesView from './JobAssigneesView'
import JobCommentsView from './JobCommentsView'
import JobDescriptionView from './JobDescriptionView'

interface JobDetailProps {
    data: TJob
    isLoading?: boolean
}
export const JobDetailView: React.FC<JobDetailProps> = ({ data: job }) => {
    const { isAdmin } = useProfile()

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
                                        <HeroCardHeader>
                                            <h3 className="text-sm uppercase">
                                                Activity logs
                                            </h3>
                                        </HeroCardHeader>
                                        <HeroCardBody>
                                            <JobActivityHistory
                                                logs={job.activityLog}
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
                        <HeroCard className="border border-border">
                            <HeroCardHeader>
                                <CirclePlus size={16} />
                                <h3 className="text-sm uppercase">
                                    Created by
                                </h3>
                            </HeroCardHeader>
                            <HeroCardBody className="gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-start gap-3">
                                        <Avatar
                                            src={optimizeCloudinary(
                                                job.createdBy.avatar
                                            )}
                                        />
                                        <p>{job.createdBy.displayName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-subdued">
                                            Create at:
                                        </p>
                                        <p className="text-sm text-text-default font-semibold">
                                            {dateFormatter(job.createdAt, {
                                                format: 'fullShort',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </HeroCardBody>
                        </HeroCard>
                    </div>
                </div>
            </div>
        </>
    )
}
