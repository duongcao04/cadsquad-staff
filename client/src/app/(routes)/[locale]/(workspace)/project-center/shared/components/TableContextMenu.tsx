'use client'

import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import { SquareArrowOutUpRight } from 'lucide-react'
import { pCenterTableStore } from '../stores'

export function TableContextMenu() {
    const isOpen = useStore(pCenterTableStore, (state) => state.openContextMenu)

    const onOpenChange = (isOpen: boolean) => {
        pCenterTableStore.setState((state) => ({
            ...state,
            openContextMenu: !isOpen,
        }))
    }

    return (
        <Dropdown isOpen={isOpen} onOpenChange={onOpenChange} className='absolute top-0 left-0'>
            <DropdownTrigger>a</DropdownTrigger>
            <DropdownMenu aria-label="Job menu actions">
                <DropdownSection key="feature_actions" title="View">
                    <DropdownItem
                        key="openInNewTab"
                        startContent={
                            <SquareArrowOutUpRight
                                className="text-text-subdued"
                                size={14}
                            />
                        }
                    >
                        Open in new tab
                    </DropdownItem>
                    <DropdownItem
                        key="openInNewTabHi"
                        startContent={
                            <SquareArrowOutUpRight
                                className="text-text-subdued"
                                size={14}
                            />
                        }
                    >
                        Test hi
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}
