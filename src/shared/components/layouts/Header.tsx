'use client'

import React, { useState } from 'react'

import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Kbd,
    User as UserComp,
    addToast,
    useDisclosure,
} from '@heroui/react'
import { Layout } from 'antd'
import { LogOut, Search, User, UserCircle } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useKeyboardShortcuts } from 'use-keyboard-shortcuts'

import AppLoader from '@/app/[locale]/loading'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { logoutSession } from '@/lib/auth/session'
import { supabase } from '@/lib/supabase/client'
import { clearCache } from '@/lib/swr/actions'
import { useAuthStore } from '@/lib/zustand/useAuthStore'

import CadsquadLogo from '../CadsquadLogo'
import { CircleHelpIcon } from '../icons/animate/CircleHelpIcon'
import { SettingsGearIcon } from '../icons/animate/SettingsGearIcon'
import NotificationDropdown from './NotificationDropdown'
import SearchModal from './SearchModal'
import { MotionButton } from '@/lib/motion'
import { Variants } from 'motion/react'

const { Header: AntHeader } = Layout

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
        boxShadow:
            'rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset',
        background: 'var(--color-text3)',
    },
}

const Header = () => {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const { isOpen, onClose, onOpen } = useDisclosure()

    const [isLoading, setLoading] = useState(false)

    const authUser = useAuthStore((state) => state.authUser)
    const { removeAuthUser } = useAuthStore()

    useKeyboardShortcuts([
        {
            keys: ['ctrl', 'K'],
            onEvent: () => onOpen(),
        },
    ])

    const handleLogout = async () => {
        try {
            setLoading(true)
            await supabase.auth.signOut()
            await logoutSession(authUser)
            removeAuthUser()
            clearCache()
            addToast({
                title: 'Logout successfully!',
                color: 'success',
            })
            router.push({
                pathname: `${locale}/auth`,
                query: { redirect: pathname },
            })
        } catch (error) {
            addToast({
                title: 'Logout failed!',
                description: `${error}`,
                color: 'danger',
            })
        } finally {
            setLoading(false)
        }
    }

    if (isLoading) return <AppLoader />

    return (
        <AntHeader
            style={{
                background: 'transparent',
                // boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: 0,
                overflow: 'hidden',
                height: '56px',
            }}
            className="border-b border-border"
        >
            {/* Logo */}
            <div className="h-full container grid grid-cols-[130px_1fr_220px] gap-5 items-center">
                <CadsquadLogo
                    classNames={{
                        logo: 'h-8',
                    }}
                />

                {/* Search bar */}
                {/* <Input
                    placeholder="Search every thing"
                    startContent={<Search size={16} color="#999" />}
                    size="md"
                    radius="full"
                    classNames={{
                        base: 'w-[450px]',
                    }}
                    endContent={<Kbd keys={['command']}>K</Kbd>}
                /> */}
                {/* <Button
                    startContent={<Search size={16} color="#999" />}
                    size="sm"
                    radius="full"
                    variant="bordered"
                    className="bg-white border-[1px] max-w-[350px]"
                    onPress={onOpen}
                >
                    <p className="pr-[200px]">Search every thing</p>
                    <Kbd
                        keys={['ctrl']}
                        onKeyDown={() => {
                            onOpen()
                        }}
                    >
                        K
                    </Kbd>
                </Button> */}
                <div className="w-full">
                    <div className="w-full flex items-center justify-center">
                        <MotionButton
                            variants={buttonVariants}
                            initial="init"
                            animate="animate"
                            whileHover="hover"
                            className="max-w-[500px] border-[1px] border-border rounded-full bg-text-fore1 cursor-pointer"
                            onClick={onOpen}
                        >
                            <div className="px-3 py-1.5 w-[420px] flex items-center justify-between">
                                <div className="flex items-center justify-start gap-3">
                                    <Search size={16} />
                                    <p className="block text-sm">Search ...</p>
                                </div>
                                <Kbd
                                    keys={['command']}
                                    onKeyDown={() => {
                                        onOpen()
                                    }}
                                    classNames={{
                                        base: 'opacity-85',
                                    }}
                                >
                                    K
                                </Kbd>
                            </div>
                        </MotionButton>
                    </div>
                    <SearchModal isOpen={isOpen} onClose={onClose} />
                </div>

                {/* Right actions */}
                <div className="h-full flex justify-end items-center gap-3">
                    <div className="flex items-center justify-end gap-3">
                        {/* Notification Bell */}
                        <NotificationDropdown />
                        {/* Settings */}
                        <Link
                            href={'/settings'}
                            className="size-8 flex items-center justify-center"
                            passHref
                        >
                            <Button
                                variant="light"
                                startContent={<SettingsGearIcon size={18} />}
                                size="sm"
                                isIconOnly
                                onPress={() => console.log('Settings clicked')}
                            />
                        </Link>
                        {/* Help */}
                        <Button
                            variant="light"
                            startContent={<CircleHelpIcon size={18} />}
                            size="sm"
                            isIconOnly
                            onPress={() => console.log('Help clicked')}
                        />
                    </div>

                    <div className="h-[50%] w-[1.5px] bg-border ml-1.5 mr-3" />

                    {/* User Avatar with Dropdown */}
                    <Dropdown
                        showArrow
                        classNames={{
                            base: 'before:bg-default-200', // change arrow background
                            content:
                                'p-0 border-small border-divider bg-background',
                        }}
                        radius="sm"
                        placement="bottom-end"
                    >
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                className="cursor-pointer"
                                color="danger"
                                icon={<User size={18} />}
                                src={authUser?.avatar}
                                classNames={{
                                    base: 'size-8',
                                }}
                                size="sm"
                                suppressHydrationWarning
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="User menu" className="p-3">
                            <DropdownSection showDivider aria-label="Profile">
                                <DropdownItem
                                    key="profile"
                                    className="h-14 gap-2 opacity-100"
                                    hrefLang={locale}
                                    href="/profile"
                                >
                                    <UserComp
                                        avatarProps={{
                                            size: 'sm',
                                            src: authUser?.avatar,
                                        }}
                                        classNames={{
                                            name: 'text-default-600',
                                            description: 'text-default-500',
                                        }}
                                        name={authUser?.name}
                                        description={`@${authUser?.username}`}
                                    />
                                </DropdownItem>
                                <DropdownItem
                                    key="onBoarding"
                                    hrefLang={locale}
                                    href="/overview"
                                >
                                    Overview
                                </DropdownItem>
                                <DropdownItem
                                    key="settings"
                                    hrefLang={locale}
                                    href="/settings"
                                >
                                    Settings
                                </DropdownItem>
                            </DropdownSection>

                            <DropdownSection aria-label="Help & Settings">
                                <DropdownItem
                                    key="helpCenter"
                                    startContent={<UserCircle size={16} />}
                                    href="/help-center"
                                    hrefLang={locale}
                                >
                                    Help Center
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    startContent={<LogOut size={16} />}
                                    color="danger"
                                    onPress={handleLogout}
                                >
                                    Logout
                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </AntHeader>
    )
}

export default Header
