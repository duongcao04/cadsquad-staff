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

const itemVariants: Variants = {
    init: { opacity: 0, background: 'transparent' },
    animate: { opacity: 1, background: 'transparent' },
    hover: {
        opacity: 1,
        background: 'hsl(0,0%,80%)',
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
        <div
            className="w-full rounded-2xl px-6 py-8 space-y-3.5"
            style={{
                background: 'hsl(0,0%,95%)',
            }}
        >
            {settingNavigate.map((group) => {
                return (
                    <div key={group.id}>
                        <p className="text-sm font-medium text-text1p5">
                            {group.groupTitle}
                        </p>
                        {group.children.map((item) => {
                            return (
                                <Link key={item.id} passHref href={item.href}>
                                    <MotionDiv
                                        variants={itemVariants}
                                        initial="init"
                                        animate={
                                            pathname === item.href
                                                ? 'hover'
                                                : 'animate'
                                        }
                                        whileHover="hover"
                                        className="mt-0.5 flex items-center justify-start gap-3 px-3 py-2 cursor-pointer rounded-lg"
                                    >
                                        <item.icon
                                            size={24}
                                            className="text-text1p5"
                                        />
                                        <p>{item.title}</p>
                                    </MotionDiv>
                                </Link>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}
