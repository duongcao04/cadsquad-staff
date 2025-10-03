'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { MotionAside, MotionButton, MotionDiv, MotionP } from '@/lib/motion'
import { type SidebarItem, appSidebar } from '@/shared/constants/appSidebar'
import { ESidebarStatus, useUiStore } from '@/shared/stores/uiStore'
import { Variants } from 'motion/react'
import { useLocale } from 'next-intl'
import { Dispatch, SetStateAction, useState } from 'react'
import SidebarCalendar from '../SidebarCalendar'
import { IconCalendar } from '../icons/sidebar-icons/IconCalendar'
import {
    IconCollapse,
    IconCollapseOutline,
} from '../icons/sidebar-icons/IconCollapse'

const sidebarData = appSidebar

export default function Sidebar() {
    const pathname = usePathname()
    const initActivated = sidebarData.find((i) => i.path === pathname) || null
    const [activated, setActivated] = useState<SidebarItem | null>(
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
            className="min-h-[calc(100vh-56px-80px)] rounded-full py-3"
        >
            <div className="w-full pl-4 pr-1.5">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={() => toggleSidebar()}
                >
                    {sidebarStatus === ESidebarStatus.EXPAND && (
                        <p className="p-2 text-sm font-semibold leading-5 text-nowrap overflow-hidden">
                            Điều hướng
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
                {sidebarData.map((item, index) => {
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
            <div className="h-22" />
            <div className="w-full">
                <div className="flex items-center justify-between cursor-pointer">
                    <div className="pl-4 pr-1.5">
                        {sidebarStatus === ESidebarStatus.EXPAND && (
                            <p className="p-2 text-sm font-semibold leading-5 text-nowrap overflow-hidden">
                                Lịch
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

const SidebarItem = ({
    data,
    isActivated,
    setActivated,
}: {
    data: SidebarItem
    isActivated: boolean
    setActivated: Dispatch<SetStateAction<SidebarItem | null>>
}) => {
    const { sidebarStatus } = useUiStore()
    const locale = useLocale()

    const buttonVariants: Variants = {
        init: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
            color: 'var(--text-1p5)',
        },
        active: {
            opacity: 1,
            color: 'var(--color-text1)',
        },
        hover: {
            opacity: 1,
        },
    }
    const leftLineVariants: Variants = {
        init: {
            opacity: 0,
            background: 'hsl(0,0%,80%)',
            transition: {
                duration: 0.1,
            },
        },
        animate: {
            opacity: 1,
            background: 'var(--color-primary)',
            transition: {
                duration: 0.1,
            },
        },
        hover: {
            opacity: 1,
            background: 'hsl(0,0%,80%)',
            transition: {
                duration: 0.1,
            },
        },
    }

    const textVariants: Variants = {
        init: {
            color: 'var(--color-text1p5)',
        },
        animate: {
            color: 'var(--color-text1)',
        },
    }

    const title = locale === 'vi' ? data.viTitle : data.title

    return (
        <MotionDiv
            className="size-full"
            initial="init"
            animate={isActivated ? 'animate' : 'init'}
            whileHover={!isActivated ? 'hover' : 'animate'}
            onClick={() => setActivated(data)}
        >
            <Link
                href={data.path}
                prefetch
                passHref
                className="grid grid-cols-[16px_1fr] place-items-center"
                title={title}
            >
                <div className="w-4 flex items-center">
                    <MotionDiv
                        variants={leftLineVariants}
                        className="ml-1.5 h-4 bg-primary w-[3px] rounded-full"
                    />
                </div>
                <MotionButton
                    variants={buttonVariants}
                    animate="animate"
                    className="w-full group cursor-pointer flex items-center justify-start rounded-lg hover:bg-[hsl(0,0%,93%)] transition duration-200"
                >
                    <div className="py-2 px-2.5">
                        {isActivated ? (
                            <data.iconFill
                                className="text-primary"
                                width={20}
                                height={20}
                            />
                        ) : (
                            <data.icon width={20} height={20} />
                        )}
                    </div>

                    {sidebarStatus === ESidebarStatus.EXPAND && (
                        <MotionP
                            variants={textVariants}
                            className={`text-sm ${
                                isActivated ? 'font-semibold' : ''
                            } text-nowrap overflow-hidden py-2 pr-2 pl-0.5`}
                        >
                            {title}
                        </MotionP>
                    )}
                </MotionButton>
            </Link>
        </MotionDiv>
    )
}
