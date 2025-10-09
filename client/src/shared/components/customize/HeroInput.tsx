'use client'

import { extendVariants, Input } from '@heroui/react'

export const HeroInput = extendVariants(Input, {
    variants: {
        color: {
            base: {
                inputWrapper: [
                    'shadow-none',
                    'border',
                    'border-text3',
                    '!bg-background',
                    'transition',
                    'duration-100',
                    'focus-within:border-primary',
                    'data-[hover=true]:border-primary',
                ],
            },
        },
    },
    defaultVariants: {
        color: 'base',
        size: 'sm',
    },
})
