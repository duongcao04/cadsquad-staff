'use client'
import { extendVariants, Select, SelectItem } from '@heroui/react'

export const HeroSelect = extendVariants(Select, {
    defaultVariants: {
        size: 'sm',
    },
})
export const HeroSelectItem = extendVariants(SelectItem, {})
