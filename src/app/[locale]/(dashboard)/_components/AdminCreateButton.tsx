'use client'

import React from 'react'

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
import { useKeyboardShortcuts } from 'use-keyboard-shortcuts'

import { IconAlertColorful } from '@/shared/components/icons/IconAlertColorful'
import { IconFileColorful } from '@/shared/components/icons/IconFileColorful'
import { IconFolderColorful } from '@/shared/components/icons/IconFolderColorful'
import { IconPeopleColorful } from '@/shared/components/icons/IconPeopleColorful'
import { IconWorkColorful } from '@/shared/components/icons/IconWorkColorful'

import JobModal from './JobModal'
import NotificationModal from './NotificationModal'
import UserModal from './UserModal'
import { ESidebarStatus, useUiStore } from '@/shared/stores/uiStore'
import { Variants } from 'motion/react'
import { MotionDiv } from '@/lib/motion'

export default function AdminCreateButton() {
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
            <JobModal isOpen={isOpenJM} onClose={onCloseJM} />
            <UserModal isOpen={isOpenUM} onClose={onCloseUm} />
            <NotificationModal isOpen={isOpenNM} onClose={onCloseNM} />
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
                            Create
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
                            Job
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection showDivider>
                        <DropdownItem
                            key="createFolder"
                            shortcut="Ctrl + ⇧ + F"
                            startContent={<IconFolderColorful />}
                        >
                            Folder
                        </DropdownItem>
                        <DropdownItem
                            key="createFile"
                            shortcut="Ctrl + ⇧ + G"
                            startContent={<IconFileColorful />}
                        >
                            File
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection>
                        <DropdownItem
                            key="createUser"
                            shortcut="Alt + U"
                            startContent={<IconPeopleColorful />}
                            onPress={() => onOpenUM()}
                        >
                            User
                        </DropdownItem>
                        <DropdownItem
                            key="sendNotification"
                            shortcut="Alt + M"
                            startContent={<IconAlertColorful />}
                            onPress={() => onOpenNM()}
                        >
                            Notification
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </MotionDiv>
    )
}
