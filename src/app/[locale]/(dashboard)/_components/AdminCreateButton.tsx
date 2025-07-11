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

import { IconFileColorful } from '@/shared/components/icons/IconFileColorful'
import { IconFolderColorful } from '@/shared/components/icons/IconFolderColorful'
import { IconPeopleColorful } from '@/shared/components/icons/IconPeopleColorful'
import { IconWorkColorful } from '@/shared/components/icons/IconWorkColorful'

import JobModal from './JobModal'
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

    useKeyboardShortcuts([
        {
            keys: ['ctrl', 'J'],
            onEvent: () => onOpenJM(),
        },
        {
            keys: ['ctrl', 'shift' + 'F'],
            onEvent: () => onOpenJM(),
        },
        {
            keys: ['ctrl', 'U'],
            onEvent: () => onOpenUM(),
        },
    ])

    return (
        <div>
            <JobModal isOpen={isOpenJM} onClose={onCloseJM} />
            <UserModal isOpen={isOpenUM} onClose={onCloseUm} />
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
                            key="new"
                            shortcut="Ctrl + J"
                            startContent={<IconWorkColorful />}
                            onPress={() => onOpenJM()}
                        >
                            Job
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection showDivider>
                        <DropdownItem
                            key="copy"
                            shortcut="Ctrl + ⇧ + F"
                            startContent={<IconFolderColorful />}
                        >
                            Folder
                        </DropdownItem>
                        <DropdownItem
                            key="edit"
                            shortcut="Ctrl + ⇧ + G"
                            startContent={<IconFileColorful />}
                        >
                            File
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection>
                        <DropdownItem
                            key="edit"
                            shortcut="Ctrl + U"
                            startContent={<IconPeopleColorful />}
                            onPress={() => onOpenUM()}
                        >
                            User
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}
