'use client'

import { usePathname } from '@/i18n/navigation'
import { MotionAside } from '@/lib/motion'
import {
    IconCalendarOutline,
    IconCollapse,
    IconCollapseOutline,
} from '@/shared/components'
import { ESidebarStatus, useUiStore } from '@/shared/stores/uiStore'
import { Variants } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import SidebarItem from './SidebarItem'
import TaskCalendarPopover from './TaskCalendarPopover'
import {
    IconWorkbench,
    IconWorkbenchOutline,
} from '@/shared/components/icons/sidebar-icons/IconWorkbench'
import {
    IconOnboard,
    IconOnboardOutline,
} from '@/shared/components/icons/sidebar-icons/IconOnboard'
import { SVGProps } from 'react'
import TaskCalendar from './TaskCalendar'

export type TSidebarItem = {
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement
    iconFill: (props: SVGProps<SVGSVGElement>) => React.ReactElement
    titleKey: string
    path: string
}
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
    const t = useTranslations()
    const pathname = usePathname()
    const initActivated =
        sidebarActions.find((i) => i.path === pathname) || null
    const [activated, setActivated] = useState<TSidebarItem | null>(
        initActivated
    )
    const [isHover, setHover] = useState(false)
    const { sidebarStatus, toggleSidebar } = useUiStore()

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
                                {t('navigate')}
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
