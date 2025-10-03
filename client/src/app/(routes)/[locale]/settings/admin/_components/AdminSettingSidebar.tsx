'use client'

import React from 'react'
import { Variants } from 'motion/react'
import { MotionDiv } from '@/lib/motion'
import { Link, usePathname } from '@/i18n/navigation'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@heroui/react'
import { useLocale } from 'next-intl'
import { ADMIN_SETTING_NAV } from '../constants/adminSettingNavigate'

const itemVariants: Variants = {
    init: { opacity: 0, background: 'transparent' },
    animate: { opacity: 1, background: 'transparent' },
    active: {
        opacity: 1,
        fontWeight: '600',
        background: 'var(--color-text3)',
        transition: {
            duration: 0.05,
        },
    },
    hover: {
        opacity: 1,
        background: 'var(--color-text3)',
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
        background: 'var(--color-text2)',
        transition: {
            duration: 0.05,
        },
    },
}
export default function AdminSettingSidebar() {
    const locale = useLocale()
    const pathname = usePathname()
    const admSettingNav =
        locale === 'vi' ? ADMIN_SETTING_NAV : ADMIN_SETTING_NAV

    return (
        <div className="w-full rounded-2xl space-y-3.5">
            <div className="flex items-center justify-start gap-2 pl-4">
                <Link href={'/'} passHref>
                    <Button isIconOnly size="sm" variant="light">
                        <ChevronLeft size={18} />
                    </Button>
                </Link>
                <h1 className="overflow-hidden text-sm font-semibold leading-5 text-nowrap">
                    Admin Settings
                </h1>
            </div>
            {admSettingNav.map((group) => {
                return (
                    <div key={group.id}>
                        <p className="pl-4 text-sm font-medium text-text2">
                            {group.groupTitle}
                        </p>
                        {group.children.map((item) => {
                            const isActivated = pathname === item.href
                            return (
                                <MotionDiv
                                    key={item.id}
                                    initial="init"
                                    whileHover={isActivated ? 'active' : 'hover'}
                                    animate={isActivated ? 'active' : 'animate'}
                                    className="size-full"
                                >
                                    <Link
                                        passHref
                                        href={item.href}
                                        className="relative inline-block w-full h-full"
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
                                            className="px-4 py-2 mt-0.5 flex items-center justify-start gap-3 cursor-pointer"
                                        >
                                            <item.icon
                                                size={20}
                                                className="text-text1p5"
                                            />
                                            <p className="text-sm">
                                                {item.title}
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
