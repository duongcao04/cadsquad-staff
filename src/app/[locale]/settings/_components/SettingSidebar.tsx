'use client'

import React from 'react'
import {
    SETTING_NAVIGATE,
    VI_SETTING_NAVIGATE,
} from '../constants/settingNavigate'
import { useLocale } from 'next-intl'
import { Variants } from 'motion/react'
import { MotionDiv } from '@/lib/motion'
import Link from 'next/link'
import { usePathname } from '@/i18n/navigation'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@heroui/react'

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

export default function SettingSidebar() {
    const pathname = usePathname()
    const locale = useLocale()
    const settingNavigate =
        locale === 'vi' ? VI_SETTING_NAVIGATE : SETTING_NAVIGATE

    return (
        <div className="w-full rounded-2xl space-y-3.5">
            <div className="pl-4 flex items-center justify-start gap-2">
                <Link href={'/'} passHref>
                    <Button isIconOnly size="sm" variant="light">
                        <ChevronLeft size={18} />
                    </Button>
                </Link>
                <h1 className="text-sm font-semibold leading-5 text-nowrap overflow-hidden">
                    Settings
                </h1>
            </div>
            {settingNavigate.map((group) => {
                return (
                    <div key={group.id}>
                        <p className="pl-4 text-sm font-medium text-text2">
                            {group.groupTitle}
                        </p>
                        {group.children.map((item) => {
                            const isActived = pathname === item.href
                            return (
                                <MotionDiv
                                    key={item.id}
                                    initial="init"
                                    whileHover={isActived ? 'active' : 'hover'}
                                    animate={isActived ? 'active' : 'animate'}
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
