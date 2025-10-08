'use client'

import {
    sidebarActions,
    type SidebarItem as SidebarItemType,
} from '@/app/(routes)/[locale]/(workspace)/shared/actions/sidebarActions'
import { usePathname } from '@/i18n/navigation'
import { MotionAside } from '@/lib/motion'

import { Variants } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { ESidebarStatus, useUiStore } from '../../../stores/uiStore'
import { IconCalendar } from '../../icons/sidebar-icons/IconCalendar'
import {
    IconCollapse,
    IconCollapseOutline,
} from '../../icons/sidebar-icons/IconCollapse'
import SidebarCalendar from './SidebarCalendar'
import SidebarItem from './SidebarItem'

export default function Sidebar() {
    const t = useTranslations()
    const pathname = usePathname()
    const initActivated =
        sidebarActions.find((i) => i.path === pathname) || null
    const [activated, setActivated] = useState<SidebarItemType | null>(
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
            className="size-full rounded-full my-3 flex flex-col justify-between"
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
                <div className="flex flex-col gap-0.5">
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
                <div className="flex items-center justify-between cursor-pointer">
                    <div className="pl-4 pr-1.5">
                        {sidebarStatus === ESidebarStatus.EXPAND && (
                            <p className="p-2 text-sm font-semibold leading-5 text-nowrap overflow-hidden">
                                {t('calendar')}
                            </p>
                        )}
                    </div>
                    <div className="pl-2">
                        {sidebarStatus === ESidebarStatus.COLLAPSE && (
                            <div className="py-2 px-2.5">
                                <IconCalendar
                                    width={20}
                                    height={20}
                                    strokeWidth={0}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-1.5 pl-2 size-full bg-background rounded-lg">
                    {sidebarStatus === ESidebarStatus.EXPAND && (
                        <SidebarCalendar />
                    )}
                </div>
            </div>
        </MotionAside>
    )
}
