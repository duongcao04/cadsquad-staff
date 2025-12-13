import { Avatar, useDisclosure } from '@heroui/react'
import { UserRoundPlus } from 'lucide-react'
import { optimizeCloudinary } from '@/lib/cloudinary'
import { useJobAssignees, useProfile } from '@/lib/queries'
import AssignMemberModal from '../project-center/AssignMemberModal'
import { HeroButton } from '../ui/hero-button'
import { HeroCard, HeroCardBody, HeroCardHeader } from '../ui/hero-card'
import { HeroChip } from '../ui/hero-chip'
import { HeroTooltip } from '../ui/hero-tooltip'

type JobAssigneesViewProps = { jobId: string; jobNo: string }
export default function JobAssigneesView({
    jobId,
    jobNo,
}: JobAssigneesViewProps) {
    const { data: assignees, totalAssignees } = useJobAssignees(jobId)
    const { isAdmin } = useProfile()

    const { isOpen, onClose, onOpen } = useDisclosure({
        id: 'AssignMemberModal',
    })

    return (
        <>
            <AssignMemberModal
                jobNo={jobNo}
                onClose={onClose}
                isOpen={Boolean(jobNo) && isOpen}
            />
            <HeroCard>
                {/* Assignees */}
                <HeroCardHeader className="justify-between py-1">
                    <h3 className="text-sm uppercase">
                        Assignees ({totalAssignees})
                    </h3>
                    {isAdmin && (
                        <HeroTooltip content="Assign / Reassign">
                            <HeroButton
                                isIconOnly
                                className="size-8.5! aspect-square!"
                                variant="light"
                                onPress={onOpen}
                            >
                                <UserRoundPlus
                                    size={14}
                                    className="text-text-subdued"
                                />
                            </HeroButton>
                        </HeroTooltip>
                    )}
                </HeroCardHeader>
                <HeroCardBody className="gap-6">
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-3">
                        {assignees?.map((user) => (
                            <HeroChip
                                key={user.id}
                                avatar={
                                    <Avatar
                                        name={user.displayName}
                                        src={optimizeCloudinary(user.avatar)}
                                    />
                                }
                                size="lg"
                                variant="bordered"
                            >
                                {user.displayName}
                            </HeroChip>
                        ))}
                        <div className="flex flex-col items-center w-full">
                            {totalAssignees === 0 && (
                                <p className="text-text-subdued text-sm whitespace-pre-line leading-relaxed text-center">
                                    No assignees yet.
                                </p>
                            )}
                            {totalAssignees === 0 && isAdmin && (
                                <button
                                    className="text-text-subdued text-sm underline underline-offset-2 hover:text-text-default cursor-pointer w-fit"
                                    onClick={onOpen}
                                >
                                    Assign anyone
                                </button>
                            )}
                        </div>
                    </div>
                </HeroCardBody>
            </HeroCard>
        </>
    )
}
