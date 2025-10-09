'use client'

import { Link } from '@/i18n/navigation'
import { MotionButton } from '@/lib/motion'
import {
    CadsquadLogo,
    NotificationDropdown,
    SettingsDropdown,
    UserDropdown,
} from '@/shared/components'
import { Button, Kbd } from '@heroui/react'
import { CircleHelpIcon, Search } from 'lucide-react'
import { Variants } from 'motion/react'
import { useTranslations } from 'next-intl'

const buttonVariants: Variants = {
    init: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        boxShadow: 'none',
        background: 'var(--color-text-fore1)',
    },
    hover: {
        opacity: 1,
        background: 'var(--color-text3)',
    },
}

export const AdminHeader = () => {
    const t = useTranslations('common')

    return (
        <div
            style={{
                background: 'transparent',
                padding: 0,
                overflow: 'hidden',
                height: '56px',
            }}
            className="border-b border-border"
        >
            {/* Logo */}
            <div className="h-full container grid grid-cols-[180px_1fr_220px] gap-5 items-center">
                <Link
                    href="/admin"
                    className="flex items-end justify-start group"
                >
                    <CadsquadLogo
                        classNames={{
                            logo: 'h-8',
                        }}
                        canRedirect={false}
                    />
                    <p className="pl-1 font-medium font-quicksand text-2xl text-text1p5 group-hover:underline">
                        Admin
                    </p>
                </Link>
                <div className="w-full">
                    <div className="w-full flex items-center justify-center">
                        <MotionButton
                            variants={buttonVariants}
                            initial="init"
                            animate="animate"
                            whileHover="hover"
                            className="max-w-[500px] border-[1px] border-border rounded-full bg-text-fore1 cursor-pointer"
                        >
                            <div className="px-3 py-1.5 w-[420px] flex items-center justify-between">
                                <div className="flex items-center justify-start gap-3">
                                    <Search size={16} className="text-text2" />
                                    <p className="block text-sm text-text2">
                                        {t('search')} ...
                                    </p>
                                </div>
                                <Kbd
                                    classNames={{
                                        base: 'opacity-85',
                                    }}
                                >
                                    Ctrl + K
                                </Kbd>
                            </div>
                        </MotionButton>
                    </div>
                    {/* <SearchModal isOpen={isOpen} onClose={onClose} /> */}
                </div>

                <div className="h-full flex justify-end items-center gap-3">
                    <div className="flex items-center justify-end gap-3">
                        <NotificationDropdown />
                        <Button
                            variant="light"
                            startContent={<CircleHelpIcon size={18} />}
                            size="sm"
                            isIconOnly
                            onPress={() => console.log('Help clicked')}
                        />
                        <SettingsDropdown />
                    </div>

                    <div className="h-[50%] w-[1.5px] bg-border ml-1.5 mr-3" />

                    <UserDropdown />
                </div>
            </div>
        </div>
    )
}
