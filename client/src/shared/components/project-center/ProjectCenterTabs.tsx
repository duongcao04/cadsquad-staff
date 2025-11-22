'use client'

import { useRouter } from '@/i18n/navigation'
import { useJobs, useProfile } from '@/lib/queries'
import { PROJECT_CENTER_TABS } from '@/lib/utils'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { Tab, Tabs, TabsProps } from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import {
    CircleCheckBig,
    ClockAlert,
    PinIcon,
    SquareX,
    Truck,
    Vote,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { Key, useMemo } from 'react'
import { metadataStore, projectCenterStore } from '../../stores'

type Props = { defaultTab?: string }
type TabItem = Omit<TabsProps, 'title'> & { title: React.ReactNode }

function ProjectCenterTabs({ defaultTab }: Props) {
    const t = useTranslations()
    const router = useRouter()

    const tabState = useStore(projectCenterStore, (state) => state.tab)

    const { isAdmin } = useProfile()

    const { paginate: priorityPaginate } = useJobs({
        tab: PROJECT_CENTER_TABS.priority,
    })
    const { paginate: activePaginate } = useJobs({
        tab: PROJECT_CENTER_TABS.active,
    })
    const { paginate: cancelledPaginate } = useJobs({
        tab: PROJECT_CENTER_TABS.cancelled,
    })
    const { paginate: completedPaginate } = useJobs({
        tab: PROJECT_CENTER_TABS.completed,
    })
    const { paginate: deliveredPaginate } = useJobs({
        tab: PROJECT_CENTER_TABS.delivered,
    })
    const { paginate: latePaginate } = useJobs({
        tab: PROJECT_CENTER_TABS.late,
    })

    const tabItems: TabItem[] = useMemo(
        () => [
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
        ],
        []
    )

    const finalTabs = isAdmin
        ? tabItems.filter((item) => item.key !== 'cancelled')
        : tabItems

    const handleChangeTab = (key: Key) => {
        const tabValue = key.toString()
        metadataStore.setState((state) => {
            return { ...state, title: t(tabValue) }
        })
        projectCenterStore.setState((state) => {
            return { ...state, tab: tabValue as ProjectCenterTabEnum }
        })
        router.replace(`/project-center/${tabValue}`)
    }

    return (
        <Tabs
            aria-label="Options"
            color="primary"
            size="sm"
            classNames={{
                tabWrapper: 'border-[1px]',
                tabList: 'border-1',
            }}
            variant="bordered"
            selectedKey={defaultTab ?? tabState}
            onSelectionChange={handleChangeTab}
        >
            {finalTabs.map((tab) => {
                return <Tab key={tab.key} title={tab.title} />
            })}
        </Tabs>
    )
}
export default React.memo(ProjectCenterTabs)
