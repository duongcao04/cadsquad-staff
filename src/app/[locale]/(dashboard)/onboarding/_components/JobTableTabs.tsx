import React from 'react'
import { Tabs, Tab, TabsProps } from '@heroui/react'
import {
    CircleCheckBig,
    ClockAlert,
    PinIcon,
    SquareX,
    Truck,
    Vote,
} from 'lucide-react'
import { useCountJobByTab } from '@/queries/useJob'

type Props = { activeKey: string; onChange: (key: string) => void }

type TabItem = Omit<TabsProps, 'title'> & { title: React.ReactNode }
export default function JobTableTabs({ activeKey, onChange }: Props) {
    const { data: countActive } = useCountJobByTab('active')
    const { data: countPriority } = useCountJobByTab('priority')
    const { data: countDelivered } = useCountJobByTab('delivered')
    const { data: countLate } = useCountJobByTab('late')
    const { data: countCompleted } = useCountJobByTab('completed')
    const { data: countCancelled } = useCountJobByTab('cancelled')
    const counts = {
        active: countActive,
        priority: countPriority,
        delivered: countDelivered,
        late: countLate,
        completed: countCompleted,
        cancelled: countCancelled,
    }

    const tabItems: TabItem[] = [
        {
            key: 'priority',
            title: (
                <div className="flex items-center space-x-2">
                    <PinIcon size={16} className="rotate-45" />
                    <span>Priority</span>
                    {counts.priority ? (
                        Number(counts.priority) > 0 && (
                            <p className="w-fit text-xs">{counts.priority}</p>
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
                    {counts.active ? (
                        counts.active > 0 && (
                            <p className="w-fit text-xs">{counts.active}</p>
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
                    {counts.late ? (
                        counts.late > 0 && (
                            <p className="w-fit text-xs">{counts.late}</p>
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
                    {counts.delivered ? (
                        counts.delivered > 0 && (
                            <p className="w-fit text-xs">{counts.delivered}</p>
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
                    {counts.completed ? (
                        counts.completed > 0 && (
                            <p className="w-fit text-xs">{counts.completed}</p>
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
                    <span>Cancelled</span>
                    {counts.cancelled ? (
                        counts.cancelled > 0 && (
                            <p className="w-fit text-xs">{counts.cancelled}</p>
                        )
                    ) : (
                        <></>
                    )}
                </div>
            ),
        },
    ]
    return (
        <Tabs
            aria-label="Options"
            color="primary"
            classNames={{
                tabWrapper: 'border-[1px]',
            }}
            selectedKey={activeKey}
            onSelectionChange={(key) => {
                onChange(key.toString())
            }}
        >
            {tabItems.map((tab) => {
                return <Tab key={tab.key} title={tab.title} />
            })}
        </Tabs>
    )
}
