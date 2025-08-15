'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { type SidebarItem, appSidebar } from '@/shared/constants/appConstant'
import { MotionAside, MotionButton, MotionDiv, MotionP } from '@/lib/motion'
import { Variants } from 'motion/react'
import { Dispatch, SetStateAction, useState } from 'react'
import {
    IconCollapse,
    IconCollapseOutline,
} from '../icons/sidebar-icons/IconCollapse'
import { ESidebarStatus, useUiStore } from '@/shared/stores/uiStore'
import SidebarCalendar from '../SidebarCalendar'
import { IconCalendar } from '../icons/sidebar-icons/IconCalendar'

const sidebarData = appSidebar

export default function Sidebar() {
    const pathname = usePathname()
    const initActivedItem = sidebarData.find((i) => i.path === pathname) || null
    const [activedItem, setActivedItem] = useState<SidebarItem | null>(
        initActivedItem
    )
    const [isHover, setHover] = useState(false)
    const { sidebarStatus, toggleSidebar } = useUiStore()

    const asideVariants: Variants = {
        init: { opacity: 0 },
        expand: { opacity: 1, width: '280px' },
        collapse: { opacity: 1, width: '64px' },
    }

    return (
        <MotionAside
            variants={asideVariants}
            initial="init"
            animate={
                sidebarStatus === ESidebarStatus.EXPAND ? 'expand' : 'collapse'
            }
            className="min-h-[calc(100vh-56px-80px)] rounded-full py-3 pr-2"
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
                    const isActived = activedItem?.path === item.path
                    return (
                        <SidebarItem
                            key={index}
                            data={item}
                            isActived={isActived}
                            setActivedItem={setActivedItem}
                        />
                    )
                })}
            </div>
            <div className="h-22" />
            <div className="w-full pl-4 pr-1.5">
                <div className="flex items-center justify-between cursor-pointer">
                    {sidebarStatus === ESidebarStatus.EXPAND && (
                        <p className="p-2 text-sm font-semibold leading-5 text-nowrap overflow-hidden">
                            Lịch
                        </p>
                    )}
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
                <div className="mt-1.5 px-2">
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
    isActived,
    setActivedItem,
}: {
    data: SidebarItem
    isActived: boolean
    setActivedItem: Dispatch<SetStateAction<SidebarItem | null>>
}) => {
    const { sidebarStatus } = useUiStore()

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

    return (
        <MotionDiv
            className="size-full"
            initial="init"
            animate={isActived ? 'animate' : 'init'}
            whileHover={!isActived ? 'hover' : 'animate'}
            onClick={() => setActivedItem(data)}
        >
            <Link
                href={data.path}
                prefetch
                passHref
                className="grid grid-cols-[16px_1fr] place-items-center"
                title={data.title}
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
                        {isActived ? (
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
                                isActived ? 'font-semibold' : ''
                            } text-nowrap overflow-hidden py-2 pr-2 pl-0.5`}
                        >
                            {data.title}
                        </MotionP>
                    )}
                </MotionButton>
            </Link>
        </MotionDiv>
    )
}
