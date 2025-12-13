import { Tab, Tabs, type TabsProps } from '@heroui/react'
import { useRouter } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import {
    CircleCheckBig,
    ClockAlert,
    PinIcon,
    SquareX,
    Truck,
    Vote,
} from 'lucide-react'
import React, { type Key, useMemo } from 'react'

import { useJobs, useProfile } from '@/lib/queries'
import { PROJECT_CENTER_TABS } from '@/lib/utils'
import { ProjectCenterTabEnum } from '@/shared/enums'

import { metadataStore, projectCenterStore } from '../../stores'

type Props = { defaultTab?: string }
type TabItem = Omit<TabsProps, 'title'> & { title: React.ReactNode }

function ProjectCenterTabs({ defaultTab }: Props) {
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
        // eslint-disable-next-line react-hooks/preserve-manual-memoization
        () => [
            {
                key: 'priority',
                title: (
                    <div className="flex items-center space-x-2">
                        <PinIcon size={16} className="rotate-45" />
                        <span>Priority</span>
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
                        <span>Active</span>
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
                        <span>Late</span>
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
                        <span>Delivered</span>
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
                        <span>Completed</span>
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
                        <span>Canceled</span>
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

    const finalTabs = !isAdmin
        ? tabItems.filter((item) => item.key !== 'cancelled')
        : tabItems

    const handleChangeTab = (key: Key) => {
        const tabValue = key.toString()
        metadataStore.setState((state) => {
            return { ...state, title: tabValue }
        })
        projectCenterStore.setState((state) => {
            return { ...state, tab: tabValue as ProjectCenterTabEnum }
        })
        router.navigate({
            href: `/project-center/${tabValue}`,
        })
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
