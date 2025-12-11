'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { MotionDiv } from '@/lib/motion'
import { Button } from '@heroui/react'
import {
    BellIcon,
    ChevronLeft,
    CircleUserRound,
    Earth,
    LucideProps,
    Palette,
    ShieldPlus,
    SquareUserRound,
} from 'lucide-react'
import { Variants } from 'motion/react'
import { useTranslations } from 'next-intl'
import { ForwardRefExoticComponent, RefAttributes } from 'react'
import { INTERNAL_URLS } from '../../../../lib/utils'

type ChildrenItem = {
    id: number | string
    titleKey: string
    href: string
    target?: '_blank' | '_parent' | '_self' | '_top'
    icon: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>
}
type GroupItem = {
    id: number | string
    groupTitleKey: string
    descriptionKey?: string
    children: ChildrenItem[]
}
export type SidebarActions = GroupItem[]
export const SETTING_SIDEBAR: GroupItem[] = [
    {
        id: 1,
        groupTitleKey: 'accountSettings',
        children: [
            {
                id: 1.1,
                titleKey: 'generalInformation',
                href: '/profile',
                target: '_blank',
                icon: SquareUserRound,
            },
            {
                id: 1.2,
                titleKey: 'personalDetails',
                href: '/settings/personal_details',
                icon: CircleUserRound,
            },
            {
                id: 1.3,
                titleKey: 'passwordAndSecurity',
                href: '/settings/password_and_security',
                icon: ShieldPlus,
            },
        ],
    },
    {
        id: 2,
        groupTitleKey: 'appearance',
        children: [
            {
                id: 2.1,
                titleKey: 'appearance',
                icon: Palette,
                href: '/settings/appearance',
            },
            {
                id: 2.2,
                titleKey: 'languageAndRegion',
                icon: Earth,
                href: '/settings/language_and_region',
            },
        ],
    },
    {
        id: 3,
        groupTitleKey: 'notifications',
        children: [
            {
                id: 3.1,
                titleKey: 'notificationSettings',
                icon: BellIcon,
                href: '/settings/notifications',
            },
        ],
    },
]

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
            background: 'var(--color-text-disabled)',
            transition: {
                duration: 0.05,
            },
        },
        hover: {
            opacity: 1,
            background: 'var(--color-text-disabled)',
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
            background: 'var(--color-text-subdued)',
            transition: {
                duration: 0.05,
            },
        },
    }

    return (
        <div className="w-full space-y-3.5">
            <div className="flex items-center justify-start gap-2 pl-4">
                <Link href={INTERNAL_URLS.home} className="block">
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
                        <p className="pl-4 text-sm font-medium text-text-8 py-2">
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
                                                className="text-text-default"
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
