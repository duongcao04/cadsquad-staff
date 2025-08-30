'use client'

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Switch,
    useDisclosure,
} from '@heroui/react'
import {
    Check,
    Columns3Cog,
    EyeClosed,
    SlidersHorizontal,
    X,
} from 'lucide-react'
import React from 'react'
import ViewColumnsDrawer from './ViewColumnsDrawer'
import { useJobStore } from '../store/useJobStore'

export default function ViewSettingsDropdown() {
    const { isHideFinishItems, setHideFinishItems } = useJobStore()
    const { isOpen, onClose, onOpen } = useDisclosure()

    return (
        <>
            <ViewColumnsDrawer isOpen={isOpen} onClose={onClose} />
            <Dropdown
                placement="bottom-end"
                showArrow
                style={{
                    width: 300,
                }}
            >
                <DropdownTrigger className="hidden sm:flex">
                    <Button
                        variant="bordered"
                        className="border-[1px] bg-background"
                        isIconOnly
                        title="View settings"
                    >
                        <SlidersHorizontal size={16} />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    disallowEmptySelection
                    aria-label="View settings dropdown"
                >
                    <DropdownSection title='View settings'>
                        <DropdownItem
                            key="switch"
                            isReadOnly
                            classNames={{
                                base: 'hover:!bg-white cursor-default',
                            }}
                            startContent={
                                <EyeClosed size={16} className="text-text1p5" />
                            }
                        >
                            <div className="w-full flex items-center justify-between gap-3">
                                <p>Hide finish items</p>
                                <Switch
                                    isSelected={isHideFinishItems}
                                    size="sm"
                                    aria-label="Hide finish items"
                                    endContent={<X />}
                                    startContent={<Check />}
                                    color="success"
                                    onValueChange={(isSelected) => {
                                        setHideFinishItems(isSelected)
                                    }}
                                />
                            </div>
                        </DropdownItem>
                        <DropdownItem
                            key="columns"
                            startContent={
                                <Columns3Cog
                                    size={16}
                                    className="text-text1p5"
                                />
                            }
                            onPress={() => onOpen()}
                        >
                            View columns
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}
