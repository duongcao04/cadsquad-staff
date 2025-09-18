import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from '@heroui/react'
import { Funnel } from 'lucide-react'
import React from 'react'

export default function FilterDropdown() {
    return (
        <Dropdown placement="bottom-start" showArrow>
            <DropdownTrigger>
                <Button
                    variant="bordered"
                    className="border-[1px] bg-background"
                    startContent={<Funnel size={14} />}
                >
                    Filter
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Link Actions">
                <DropdownSection title="Filter">
                    <DropdownItem key="home" href="/home">
                        Home
                    </DropdownItem>
                    <DropdownItem key="about" href="/about">
                        About
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}
