import { useLocation } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { type Variants } from 'motion/react'
import { type SVGProps, useState } from 'react'

import { MotionAside } from '@/lib/motion'
import {
    IconCalendarOutline,
    IconCollapse,
    IconCollapseOutline,
} from '@/shared/components'
import {
    IconOnboard,
    IconOnboardOutline,
} from '@/shared/components/icons/sidebar-icons/IconOnboard'
import {
    IconWorkbench,
    IconWorkbenchOutline,
} from '@/shared/components/icons/sidebar-icons/IconWorkbench'
import { appStore, ESidebarStatus, toggleSidebar } from '@/shared/stores'

import SidebarItem from './SidebarItem'
import TaskCalendar from './TaskCalendar'
import TaskCalendarPopover from './TaskCalendarPopover'

export type TSidebarItem = {
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement
    iconFill: (props: SVGProps<SVGSVGElement>) => React.ReactElement
    titleKey: string
    path: string
}
// eslint-disable-next-line react-refresh/only-export-components
export const sidebarActions: TSidebarItem[] = [
    {
        icon: IconWorkbenchOutline,
        iconFill: IconWorkbench,
        titleKey: 'workbench',
        path: '/',
    },
    // { icon: Grip, title: 'Overview', path: '/' },
    {
        icon: IconOnboardOutline,
        iconFill: IconOnboard,
        titleKey: 'projectCenter',
        path: '/project-center',
    },
    // {
    //     icon: IconDocumentsOutline,
    //     iconFill: IconDocuments,
    //     title: 'Documents',
    //     path: '/documents',
    // },
    // {
    //     icon: IconProjectCenterOutline,
    //     iconFill: IconProjectCenter,
    //     title: 'Project Center',
    //     path: '/projects-center',
    // },
    // {
    //     icon: IconTeamOutline,
    //     iconFill: IconTeam,
    //     title: 'Team',
    //     path: '/team',
    // },
]

export function Sidebar() {
    const pathname = useLocation({
        select: (location) => location.pathname,
    })

    const initActivated =
        sidebarActions.find((i) => i.path === pathname) || null
    const [activated, setActivated] = useState<TSidebarItem | null>(
        initActivated
    )
    const [isHover, setHover] = useState(false)

    const sidebarStatus = useStore(appStore, (state) => state.sidebarStatus)

    const asideVariants: Variants = {
        init: { opacity: 0 },
        expand: { opacity: 1, width: '300px' },
        collapse: { opacity: 1, width: '64px' },
    }

    return (
        <MotionAside
            variants={asideVariants}
            initial="init"
            animate={
                sidebarStatus === ESidebarStatus.EXPAND ? 'expand' : 'collapse'
            }
            className="size-full my-3 flex flex-col justify-between"
        >
            <div id="sidebar-actions">
                <div className="w-full pl-4 pr-1.5">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        onClick={() => toggleSidebar()}
                    >
                        {sidebarStatus === ESidebarStatus.EXPAND && (
                            <p className="p-2 text-sm font-semibold leading-5 text-nowrap overflow-hidden">
                                Navigate
                            </p>
                        )}
                        <div className="py-2 px-2.5">
                            {isHover ? (
                                <IconCollapse
                                    width={20}
                                    height={20}
                                    strokeWidth={0}
                                />
                            ) : (
                                <IconCollapseOutline
                                    width={20}
                                    height={20}
                                    strokeWidth={0}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-0.5 pr-2">
                    {sidebarActions.map((item, index) => {
                        const isActivated = activated?.path === item.path
                        return (
                            <SidebarItem
                                key={index}
                                data={item}
                                isActivated={isActivated}
                                setActivated={setActivated}
                            />
                        )
                    })}
                </div>
            </div>
            <div>
                {sidebarStatus === ESidebarStatus.EXPAND && (
                    <div className="w-full pl-4 pr-1.5 flex items-center justify-start">
                        <IconCalendarOutline />
                        <p className="p-2 text-sm font-semibold leading-5 text-nowrap overflow-hidden">
                            Calendar
                        </p>
                    </div>
                )}
                {sidebarStatus === ESidebarStatus.COLLAPSE && (
                    <TaskCalendarPopover />
                )}
                <div className="mt-1.5 px-2 size-full bg-background overflow-hidden">
                    {sidebarStatus === ESidebarStatus.EXPAND && (
                        <TaskCalendar />
                    )}
                </div>
            </div>
        </MotionAside>
    )
}
