'use client'

import React from 'react'
import { Variants } from 'motion/react'
import { MotionDiv } from '@/lib/motion'
import { Link, usePathname } from '@/i18n/navigation'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { SETTING_SIDEBAR, SidebarActions } from '../actions'

export function SettingSidebar({
    title,
    sidebarData,
}: {
    title: string
    sidebarData: SidebarActions
}) {
    const tSettings = useTranslations('settings')
    const pathname = usePathname()

    const itemVariants: Variants = {
        init: { opacity: 0, background: 'transparent' },
        animate: { opacity: 1, background: 'transparent' },
        active: {
            opacity: 1,
            fontWeight: '600',
            background: 'var(--color-text-muted)',
            transition: {
                duration: 0.05,
            },
        },
        hover: {
            opacity: 1,
            background: 'var(--color-text-muted)',
            transition: {
                duration: 0.05,
            },
        },
    }
    const itemLineVariants: Variants = {
        init: { opacity: 0 },
        animate: {
            opacity: 1,
            background: 'transparent',
            transition: {
                duration: 0.05,
            },
        },
        active: {
            opacity: 1,
            background: 'var(--color-primary)',
            transition: {
                duration: 0.05,
            },
        },
        hover: {
            opacity: 1,
            background: 'var(--color-text-muted)',
            transition: {
                duration: 0.05,
            },
        },
    }

    return (
        <div className="w-full rounded-2xl space-y-3.5">
            <div className="flex items-center justify-start gap-2 pl-4">
                <Link href={'/'} passHref>
                    <Button isIconOnly size="sm" variant="light">
                        <ChevronLeft size={18} />
                    </Button>
                </Link>
                <h1 className="overflow-hidden text-sm font-semibold leading-5 text-nowrap">
                    {title}
                </h1>
            </div>
            {sidebarData.map((group) => {
                return (
                    <div key={group.id}>
                        <p className="pl-4 text-sm font-medium text-text-muted">
                            {tSettings(group.groupTitleKey)}
                        </p>
                        {group.children.map((item) => {
                            const isActivated = pathname === item.href
                            return (
                                <MotionDiv
                                    key={item.id}
                                    initial="init"
                                    whileHover={
                                        isActivated ? 'active' : 'hover'
                                    }
                                    animate={isActivated ? 'active' : 'animate'}
                                    className="size-full"
                                >
                                    <Link
                                        passHref
                                        href={item.href}
                                        className="relative inline-block w-full h-full"
                                        target={item.target}
                                    >
                                        <MotionDiv
                                            variants={itemLineVariants}
                                            className="absolute left-0 top-0 h-full w-[3px]"
                                        />
                                        <MotionDiv
                                            variants={itemVariants}
                                            initial="init"
                                            animate={
                                                pathname === item.href
                                                    ? 'active'
                                                    : 'animate'
                                            }
                                            whileHover="hover"
                                            className="px-4 py-2 mt-0.5 flex items-center justify-start gap-3 cursor-pointer rounded-md"
                                        >
                                            <item.icon
                                                size={20}
                                                strokeWidth="1.5"
                                                className="text-defaultp5"
                                            />
                                            <p className="text-sm">
                                                {tSettings(item.titleKey)}
                                            </p>
                                        </MotionDiv>
                                    </Link>
                                </MotionDiv>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export function PersonalSettingSidebar() {
    const t = useTranslations('settings')
    return (
        <SettingSidebar title={t('settings')} sidebarData={SETTING_SIDEBAR} />
    )
}
