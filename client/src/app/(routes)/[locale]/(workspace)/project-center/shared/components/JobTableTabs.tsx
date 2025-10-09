'use client'

import { JobTabEnum } from '@/shared/enums'
import { useJobs, useProfile } from '@/shared/queries'
import { Tab, Tabs, TabsProps } from '@heroui/react'
import {
    CircleCheckBig,
    ClockAlert,
    PinIcon,
    SquareX,
    Truck,
    Vote,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

type Props = { activeKey: string; onChange: (key: string) => void }
type TabItem = Omit<TabsProps, 'title'> & { title: React.ReactNode }

function JobTableTabs({ activeKey, onChange }: Props) {
    const t = useTranslations()
    const { userRole } = useProfile()
    const { paginate: priorityPaginate } = useJobs({
        tab: JobTabEnum.PRIORITY,
    })
    const { paginate: activePaginate } = useJobs({
        tab: JobTabEnum.ACTIVE,
    })
    const { paginate: cancelledPaginate } = useJobs({
        tab: JobTabEnum.CANCELLED,
    })
    const { paginate: completedPaginate } = useJobs({
        tab: JobTabEnum.COMPLETED,
    })
    const { paginate: deliveredPaginate } = useJobs({
        tab: JobTabEnum.DELIVERED,
    })
    const { paginate: latePaginate } = useJobs({
        tab: JobTabEnum.LATE,
    })

    const tabItems: TabItem[] = [
        {
            key: 'priority',
            title: (
                <div className="flex items-center space-x-2">
                    <PinIcon size={16} className="rotate-45" />
                    <span>{t('priority')}</span>
                    {priorityPaginate?.total ? (
                        Number(priorityPaginate?.total) > 0 && (
                            <p className="w-fit text-xs">
                                {priorityPaginate?.total}
                            </p>
                        )
                    ) : (
                        <></>
                    )}
                </div>
            ),
        },
        {
            key: 'active',
            title: (
                <div className="flex items-center space-x-2">
                    <Vote size={16} />
                    <span>{t('active')}</span>
                    {activePaginate?.total ? (
                        activePaginate?.total > 0 && (
                            <p className="w-fit text-xs">
                                {activePaginate?.total}
                            </p>
                        )
                    ) : (
                        <></>
                    )}
                </div>
            ),
        },
        {
            key: 'late',
            title: (
                <div className="flex items-center space-x-2">
                    <ClockAlert size={16} />
                    <span>{t('late')}</span>
                    {latePaginate?.total ? (
                        latePaginate?.total > 0 && (
                            <p className="w-fit text-xs">
                                {latePaginate?.total}
                            </p>
                        )
                    ) : (
                        <></>
                    )}
                </div>
            ),
        },
        {
            key: 'delivered',
            title: (
                <div className="flex items-center space-x-2">
                    <Truck size={16} />
                    <span>{t('delivered')}</span>
                    {deliveredPaginate?.total ? (
                        deliveredPaginate?.total > 0 && (
                            <p className="w-fit text-xs">
                                {deliveredPaginate?.total}
                            </p>
                        )
                    ) : (
                        <></>
                    )}
                </div>
            ),
        },
        {
            key: 'completed',
            title: (
                <div className="flex items-center space-x-2">
                    <CircleCheckBig size={16} />
                    <span>{t('completed')}</span>
                    {completedPaginate?.total ? (
                        completedPaginate?.total > 0 && (
                            <p className="w-fit text-xs">
                                {completedPaginate?.total}
                            </p>
                        )
                    ) : (
                        <></>
                    )}
                </div>
            ),
        },
        {
            key: 'cancelled',
            title: (
                <div className="flex items-center space-x-2">
                    <SquareX size={16} />
                    <span>{t('cancelled')}</span>
                    {cancelledPaginate?.total ? (
                        cancelledPaginate?.total > 0 && (
                            <p className="w-fit text-xs">
                                {cancelledPaginate?.total}
                            </p>
                        )
                    ) : (
                        <></>
                    )}
                </div>
            ),
        },
    ]

    const newTabItems =
        userRole !== 'ADMIN'
            ? tabItems.filter((item) => item.key !== 'cancelled')
            : tabItems

    return (
        <Tabs
            aria-label="Options"
            color="primary"
            classNames={{
                tabWrapper: 'border-[1px]',
                tabList:
                    'bg-background hover:shadow-xs transition duration-150',
            }}
            size="sm"
            selectedKey={activeKey}
            onSelectionChange={(key) => {
                onChange(key.toString())
            }}
        >
            {newTabItems.map((tab) => {
                return <Tab key={tab.key} title={tab.title} />
            })}
        </Tabs>
    )
}
export default React.memo(JobTableTabs)
