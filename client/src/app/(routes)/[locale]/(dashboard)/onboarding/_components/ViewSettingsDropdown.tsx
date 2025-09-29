'use client'

import {
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
import {
    useConfigByCode,
    useUpdateConfigByCodeMutation,
} from '@/shared/queries/useConfig'
import { CONFIG_CONSTANTS } from '@/shared/constants/config.constant'
import { HeroButton } from '@/shared/components/customize/HeroButton'

export default function ViewSettingsDropdown() {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const { value: isHideFinishItems } = useConfigByCode(
        CONFIG_CONSTANTS.keys.hideFinishItems
    )
    console.log(isHideFinishItems)

    const { mutateAsync: updateConfigByCodeMutate } =
        useUpdateConfigByCodeMutation()

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
                    <HeroButton isIconOnly title="View settings">
                        <SlidersHorizontal size={16} />
                    </HeroButton>
                </DropdownTrigger>
                <DropdownMenu
                    disallowEmptySelection
                    aria-label="View settings dropdown"
                >
                    <DropdownSection title="View settings">
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
                                    isSelected={Boolean(
                                        parseInt(isHideFinishItems)
                                    )}
                                    size="sm"
                                    aria-label="Hide finish items"
                                    endContent={<X />}
                                    startContent={<Check />}
                                    color="success"
                                    onValueChange={(isSelected) => {
                                        updateConfigByCodeMutate({
                                            code: CONFIG_CONSTANTS.keys
                                                .hideFinishItems,
                                            data: {
                                                value: isSelected ? '1' : '0',
                                            },
                                        })
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
