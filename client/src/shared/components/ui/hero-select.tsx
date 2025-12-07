'use client'

import { Select, SelectItem, SelectProps } from '@heroui/react'
import React from 'react'

type HeroSelectProps = {
    children: React.ReactNode
} & SelectProps
export const HeroSelect = ({ children, ...props }: HeroSelectProps) => {
    return (
        <Select
            variant={props.variant ?? 'bordered'}
            size={props.size ?? 'sm'}
            {...props}
        >
            {children}
        </Select>
    )
}

export { SelectItem as HeroSelectItem }
