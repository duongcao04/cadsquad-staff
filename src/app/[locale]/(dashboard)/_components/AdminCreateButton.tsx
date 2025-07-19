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

export default function AdminCreateButton() {
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

    return (
        <div>
            <JobModal isOpen={isOpenJM} onClose={onCloseJM} />
            <UserModal isOpen={isOpenUM} onClose={onCloseUm} />
            <NotificationModal isOpen={isOpenNM} onClose={onCloseNM} />
            <Dropdown>
                <DropdownTrigger>
                    <Button
                        startContent={<PlusIcon />}
                        className="pr-10 text-white rounded-full bg-gradient-to-br from-secondary-600 via-secondary-500 to-secondary-400"
                    >
                        Create
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
        </div>
    )
}
