'use client'

import { useAddMemberModal } from '@/shared/actions'
import { Job } from '@/shared/interfaces'
import { useProfile } from '@/lib/queries'
import { Skeleton } from '@heroui/react'
import { Image } from 'antd'
import { Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const Assignee = ({
    isLoading = false,
    data,
}: {
    isLoading: boolean
    data: Job
}) => {
    const t = useTranslations()
    const { isAdmin } = useProfile()
    const { openModal } = useAddMemberModal()
    return (
        <div className="w-full overflow-hidden">
            <Skeleton className="w-full h-fit rounded-md" isLoaded={!isLoading}>
                <button
                    className="w-full pl-2 pr-3 py-1.5 rounded-lg hover:bg-background-muted flex items-center justify-between"
                    style={{
                        cursor: isAdmin ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                        if (!isAdmin) {
                            return
                        }
                        openModal(data.no)
                    }}
                >
                    <p className="text-xs text-text-muted">
                        {t('jobColumns.assignee')}
                    </p>
                    {isAdmin && <Settings size={16} />}
                </button>
            </Skeleton>
            {data?.assignee &&
                data.assignee.map((member) => {
                    return (
                        <Skeleton
                            key={member.id}
                            className="rounded-md"
                            isLoaded={!isLoading}
                        >
                            <button className="w-full pl-2 pr-3 py-1.5 rounded-lg hover:bg-background-muted flex items-center justify-start cursor-pointer">
                                <Image
                                    src={member?.avatar ?? ''}
                                    alt={member?.displayName}
                                    className="rounded-full"
                                    rootClassName="size-5"
                                    preview={false}
                                />
                                <p className="text-xs font-medium pl-2 pr-3">
                                    {member?.displayName}
                                </p>
                            </button>
                        </Skeleton>
                    )
                })}
        </div>
    )
}
