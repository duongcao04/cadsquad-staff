'use client'

import { cn } from '@/lib/utils'
import { Select, SelectItem, SelectProps } from '@heroui/react'
import React from 'react'

type HeroSelectProps = {
    children: React.ReactNode
} & SelectProps
export const HeroSelect = ({ children, ...props }: HeroSelectProps) => {
    return (
        <Select
            variant={props.variant ?? 'bordered'}
            {...props}
            classNames={{
                trigger: cn('border-[1px]', props.classNames?.trigger),
                label: 'font-medium text-text-7!',
                ...props.classNames,
            }}
        >
            {children}
        </Select>
    )
}

export { SelectItem as HeroSelectItem }
