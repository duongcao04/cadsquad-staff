'use client'

import { Avatar } from '@heroui/react'
import { optimizeCloudinary } from '../../../lib/cloudinary'
import { useJobAssignees, useProfile } from '../../../lib/queries'
import { HeroCard, HeroCardBody, HeroCardHeader } from '../ui/hero-card'
import { HeroChip } from '../ui/hero-chip'

type JobAssigneesViewProps = { jobId: string }
export default function JobAssigneesView({ jobId }: JobAssigneesViewProps) {
    const { data: assignees, totalAssignees } = useJobAssignees(jobId)
    const { isAdmin } = useProfile()

    return (
        <HeroCard>
            {/* Assignees */}
            <HeroCardHeader>
                <h3 className="text-sm uppercase">
                    Assignees ({totalAssignees})
                </h3>
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
                            <p className="text-text-subdued text-sm underline underline-offset-2 hover:text-text-default cursor-pointer w-fit">
                                Assign anyone
                            </p>
                        )}
                    </div>
                </div>
            </HeroCardBody>
        </HeroCard>
    )
}
