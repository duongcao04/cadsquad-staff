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

import CadsquadLogo from '../CadsquadLogo'
import { CircleHelpIcon } from '../icons/animate/CircleHelpIcon'
import { SettingsGearIcon } from '../icons/animate/SettingsGearIcon'
import NotificationDropdown from './NotificationDropdown'
import SearchModal from './SearchModal'
import { MotionButton } from '@/lib/motion'
import { Variants } from 'motion/react'
import useAuth from '@/queries/useAuth'
import SettingsDropdown from './SettingsDropdown'

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
        background: 'var(--color-text3)',
    },
}

const Header = () => {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const { isOpen, onClose, onOpen } = useDisclosure()
    const [isLoading, setLoading] = useState(false)

    const {
        profile: { data },
        logout,
    } = useAuth()

    useKeyboardShortcuts([
        {
            keys: ['ctrl', 'K'],
            onEvent: () => onOpen(),
        },
    ])

    const handleLogout = async () => {
        try {
            setLoading(true)
            logout()
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
                                    <Search size={16} className="text-text2" />
                                    <p className="block text-sm text-text2">
                                        Search ...
                                    </p>
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
                        {/* Help */}
                        <Button
                            variant="light"
                            startContent={<CircleHelpIcon size={18} />}
                            size="sm"
                            isIconOnly
                            onPress={() => console.log('Help clicked')}
                        />
                        {/* Settings for Admin*/}
                        <SettingsDropdown />

                        {/* Settings for users 
                        <Link
                            href={'/settings/personal'}
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
                        </Link> */}
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
                                src={data?.avatar ?? ''}
                                classNames={{
                                    base: '!size-6',
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
                                            src: data?.avatar ?? '',
                                        }}
                                        classNames={{
                                            name: 'text-default-600',
                                            description: 'text-default-500',
                                        }}
                                        name={data?.name}
                                        description={`@${data?.username}`}
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
                                    href="/settings/personal"
                                >
                                    Account settings
                                </DropdownItem>
                            </DropdownSection>

                            <DropdownSection aria-label="Help & Settings">
                                <DropdownItem
                                    key="helpCenter"
                                    startContent={<UserCircle size={16} />}
                                    href="/help-center"
                                    hrefLang={locale}
                                >
                                    Help center
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
