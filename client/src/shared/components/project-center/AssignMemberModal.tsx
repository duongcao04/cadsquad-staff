'use client'

import { envConfig } from '@/lib/config'
import { useProfile, useUsers } from '@/lib/queries'
import {
    useAssignMemberMutation,
    useJobByNo,
    useRemoveMemberMutation,
} from '@/lib/queries/useJob'
import { Button, Input, Skeleton } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { Key, useState } from 'react'
import HeroCopyButton from '../ui/hero-copy-button'
import {
    HeroModal,
    HeroModalBody,
    HeroModalContent,
    HeroModalHeader,
} from '../ui/hero-modal'
import { HeroTooltip } from '../ui/hero-tooltip'
import AssignMemberCard, { AssignMemberCardSkeleton } from './AssignMemberCard'
import AssignMemberSelect from './AssignMemberSelect'

// TODO: FIX giật
type AssignMemberModalProps = {
    jobNo: string
    isOpen: boolean
    onClose: () => void
}
export default function AssignMemberModal({
    jobNo,
    isOpen,
    onClose,
}: AssignMemberModalProps) {
    const t = useTranslations()

    const { job, isLoading: loadingJob } = useJobByNo(jobNo)
    const { users, isLoading: loadingUsers } = useUsers()

    const { isAdmin } = useProfile()

    const JOB_DETAIL_URL =
        envConfig.NEXT_PUBLIC_URL + `/project-center?detail=${jobNo}`

    const [memberSelected, setMemberSelected] = useState<Key | null>(null)
    const { mutateAsync: assignMemberMutate } = useAssignMemberMutation(jobNo)
    const { mutateAsync: removeMemberMutate } = useRemoveMemberMutation(jobNo)

    const onAssignMember = async (updateMemberIds: string[]) => {
        await assignMemberMutate({
            jobId: String(job?.id),
            assignMemberInput: {
                prevMemberIds: JSON.stringify(
                    job?.assignee.map((mem) => mem.id)
                ),
                updateMemberIds: JSON.stringify(updateMemberIds),
            },
        })
    }

    const onRemoveMember = async (memberId: string) =>
        await removeMemberMutate({
            jobId: job.id,
            memberId,
        })

    const onSelectMember = (userId: Key | null) => {
        setMemberSelected(userId)
    }

    return (
        <HeroModal
            isOpen={isOpen}
            onClose={() => {
                setMemberSelected(null)
                onClose()
            }}
            classNames={{
                base: 'max-w-[90%] sm:max-w-[80%] md:max-w-[80%] xl:max-w-[50%]',
            }}
            placement="center"
        >
            <HeroModalContent>
                <HeroModalHeader>
                    <div className="size-full">
                        <p className="text-lg font-semibold mb-2.5">
                            {t('assignMemberTo', { jobNo: `#${job.no}` })}
                        </p>
                        {isAdmin && (
                            <div className="space-y-1.5">
                                <p className="font-semibold text-sm text-text-subdued">
                                    Select member
                                </p>
                                <div className="grid grid-cols-[1fr_100px] gap-4">
                                    <AssignMemberSelect
                                        job={job}
                                        users={users}
                                        loading={loadingUsers}
                                        onSelectMember={onSelectMember}
                                    />
                                    <Button
                                        onPress={async () => {
                                            if (memberSelected) {
                                                const newAssignee =
                                                    job?.assignee?.map(
                                                        (mem) => mem.id
                                                    ) || []
                                                newAssignee.push(
                                                    memberSelected as string
                                                )
                                                await onAssignMember(
                                                    newAssignee
                                                )
                                                setMemberSelected(null)
                                            }
                                        }}
                                        color="primary"
                                    >
                                        {t('assign')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </HeroModalHeader>
                <HeroModalBody className="pb-6">
                    <hr className="text-text-muted" />
                    <div>
                        <div className="space-y-2.5 min-h-[40vh] max-h-[60vh]">
                            <div className="font-medium">
                                <span>Members assigned</span>
                                <Skeleton
                                    className="ml-1 inline-block w-8 h-5 rounded-md"
                                    isLoaded={!loadingJob}
                                >
                                    <span>({job?.assignee?.length})</span>
                                </Skeleton>
                            </div>
                            <div className="space-y-1.5 max-h-[430px] overflow-y-auto -mx-2">
                                {loadingJob &&
                                    new Array(6).fill(0).map((_, idx) => {
                                        return (
                                            <AssignMemberCardSkeleton
                                                key={idx}
                                            />
                                        )
                                    })}
                                {!loadingJob && job?.assignee?.length === 0 && (
                                    <p className="my-8 text-center text-text-subdued">
                                        No members have been assigned yet.
                                    </p>
                                )}
                                {!loadingJob &&
                                    job?.assignee?.map((member) => {
                                        return (
                                            <AssignMemberCard
                                                key={member.username}
                                                data={member}
                                                onRemoveMember={onRemoveMember}
                                            />
                                        )
                                    })}
                            </div>
                        </div>
                        <hr className="mb-2 text-text-muted" />
                        <div className="flex items-center justify-start gap-4">
                            <p className="font-medium text-nowrap h-full">
                                {t('copyLink')}
                            </p>
                            <Input
                                value={JOB_DETAIL_URL}
                                className="opacity-70!"
                                endContent={
                                    <HeroTooltip content={t('copy')}>
                                        <HeroCopyButton
                                            textValue={JOB_DETAIL_URL}
                                        />
                                    </HeroTooltip>
                                }
                            />
                        </div>
                    </div>
                </HeroModalBody>
            </HeroModalContent>
        </HeroModal>
    )
}
