'use client'

import { MotionDiv } from '@/lib/motion'
import {
    CreateJobModal,
    CreateNotificationModal,
    CreateUserModal,
    IconAlertColorful,
    IconPeopleColorful,
    IconWorkColorful,
} from '@/shared/components'
import { useProfile } from '@/shared/queries'
import { ESidebarStatus, useUiStore } from '@/shared/stores'
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    useDisclosure,
} from '@heroui/react'
import { PlusIcon } from 'lucide-react'
import { Variants } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useKeyboardShortcuts } from 'use-keyboard-shortcuts'

export function ActionButton() {
    const { isAdmin, isAccounting, isStaff } = useProfile()

    if (isAdmin) {
        return <AdminCreateButton />
    }
    if (isAccounting) {
        return <AccountingButton />
    }
    if (isStaff) {
        return <StaffButton />
    }
}

export function StaffButton() {
    return <div></div>
}

export function AccountingButton() {
    return <div></div>
}

export function AdminCreateButton() {
    const t = useTranslations()
    const { sidebarStatus } = useUiStore()
    const {
        isOpen: isOpenJM,
        onOpen: onOpenJM,
        onClose: onCloseJM,
    } = useDisclosure({
        id: 'JobModal',
    })
    const {
        isOpen: isOpenUM,
        onOpen: onOpenUM,
        onClose: onCloseUm,
    } = useDisclosure({
        id: 'UserModal',
    })
    const {
        isOpen: isOpenNM,
        onOpen: onOpenNM,
        onClose: onCloseNM,
    } = useDisclosure({
        id: 'NotificationModal',
    })

    useKeyboardShortcuts([
        {
            keys: ['alt', 'N'],
            onEvent: () => onOpenJM(),
        },
        {
            keys: ['alt', 'U'],
            onEvent: () => onOpenUM(),
        },
        {
            keys: ['alt', 'M'],
            onEvent: () => onOpenNM(),
        },
    ])

    const iconVariants: Variants = {
        init: { opacity: 0, rotate: 0 },
        animate: {
            opacity: 1,
            rotate: 0,
            transition: { damping: 20, type: 'spring' },
        },
        hover: {
            opacity: 1,
            rotate: '180deg',
            transition: { damping: 20, type: 'spring' },
        },
    }

    return (
        <MotionDiv
            initial="init"
            animate="animate"
            whileHover="hover"
            className="w-fit"
        >
            <CreateJobModal isOpen={isOpenJM} onClose={onCloseJM} />
            <CreateUserModal isOpen={isOpenUM} onClose={onCloseUm} />
            <CreateNotificationModal isOpen={isOpenNM} onClose={onCloseNM} />
            <Dropdown>
                <DropdownTrigger className="w-fit">
                    <Button
                        startContent={
                            <MotionDiv variants={iconVariants}>
                                <PlusIcon size={20} />
                            </MotionDiv>
                        }
                        size="sm"
                        isIconOnly={sidebarStatus === ESidebarStatus.COLLAPSE}
                        className="text-sm text-white rounded-full bg-gradient-to-br from-primary-500 via-primary-700 to-primary-800 font-semibold"
                        style={{
                            paddingLeft:
                                sidebarStatus === ESidebarStatus.EXPAND
                                    ? '12px'
                                    : '0',
                            paddingRight:
                                sidebarStatus === ESidebarStatus.EXPAND
                                    ? '16px'
                                    : '0',
                        }}
                    >
                        <p
                            style={{
                                display:
                                    sidebarStatus === ESidebarStatus.EXPAND
                                        ? 'block'
                                        : 'none',
                            }}
                        >
                            {t('create')}
                        </p>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Admin actions" variant="flat">
                    <DropdownSection showDivider>
                        <DropdownItem
                            key="createJob"
                            shortcut="Alt + N"
                            startContent={<IconWorkColorful />}
                            onPress={() => onOpenJM()}
                        >
                            {t('job')}
                        </DropdownItem>
                    </DropdownSection>
                    {/* <DropdownSection showDivider>
                        <DropdownItem
                            key="createFolder"
                            shortcut="Ctrl + ⇧ + F"
                            startContent={<IconFolderColorful />}
                        >
                            {t('folder')}
                        </DropdownItem>
                        <DropdownItem
                            key="createFile"
                            shortcut="Ctrl + ⇧ + G"
                            startContent={<IconFileColorful />}
                        >
                            {t('file')}
                        </DropdownItem>
                    </DropdownSection> */}
                    <DropdownSection>
                        <DropdownItem
                            key="createUser"
                            shortcut="Alt + U"
                            startContent={<IconPeopleColorful />}
                            onPress={() => onOpenUM()}
                        >
                            {t('user')}
                        </DropdownItem>
                        <DropdownItem
                            key="sendNotification"
                            shortcut="Alt + M"
                            startContent={<IconAlertColorful />}
                            onPress={() => onOpenNM()}
                        >
                            {t('notification')}
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </MotionDiv>
    )
}
