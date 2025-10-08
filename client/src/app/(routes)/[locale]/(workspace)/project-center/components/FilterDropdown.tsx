import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from '@heroui/react'
import { Funnel } from 'lucide-react'
import React from 'react'
import { HeroButton } from '@/shared/components/customize/HeroButton'
import { useTranslations } from 'next-intl'

export default function FilterDropdown() {
    const t = useTranslations()
    return (
        <Dropdown placement="bottom-end" showArrow size="sm">
            <DropdownTrigger>
                <HeroButton
                    variant="bordered"
                    startContent={<Funnel size={14} />}
                >
                    {t('filter')}
                </HeroButton>
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
