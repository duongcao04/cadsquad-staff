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

import { IconFileColorful } from '@/shared/components/icons/IconFileColorful'
import { IconFolderColorful } from '@/shared/components/icons/IconFolderColorful'
import { IconPeopleColorful } from '@/shared/components/icons/IconPeopleColorful'
import { IconWorkColorful } from '@/shared/components/icons/IconWorkColorful'

import JobModal from './JobModal'

export default function AdminCreateButton() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <JobModal isOpen={isOpen} onClose={onClose} />
            <Dropdown>
                <DropdownTrigger>
                    <Button
                        startContent={<PlusIcon />}
                        className="rounded-full bg-gradient-to-br from-secondary-600 via-secondary-500 to-secondary-400 pr-10 text-white"
                    >
                        Create
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Admin actions" variant="flat">
                    <DropdownSection showDivider>
                        <DropdownItem
                            key="new"
                            shortcut="Ctrl + N"
                            startContent={<IconWorkColorful />}
                            onPress={() => onOpen()}
                        >
                            Job
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection showDivider>
                        <DropdownItem
                            key="copy"
                            shortcut="Ctrl + ⇧ + L"
                            startContent={<IconFolderColorful />}
                        >
                            Folder
                        </DropdownItem>
                        <DropdownItem
                            key="edit"
                            shortcut="Ctrl + ⇧ + F"
                            startContent={<IconFileColorful />}
                        >
                            File
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection>
                        <DropdownItem
                            key="edit"
                            shortcut="Ctrl + ⇧ + U"
                            startContent={<IconPeopleColorful />}
                        >
                            User
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}
