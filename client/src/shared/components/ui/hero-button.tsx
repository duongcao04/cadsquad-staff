'use client'

import { Button, extendVariants } from '@heroui/react'

export const HeroButton = extendVariants(Button, {
    variants: {
        // We override/extend the 'color' variant
        color: {
            // 1. Blue (Info) - Custom variant
            blue: 'bg-blue-500 text-white hover:shadow-xs shadow-blue-500/40 data-[hover=true]:bg-blue-600',

            // 2. Warning - Custom styling or override
            warning:
                'bg-orange-500 text-white hover:shadow-xs shadow-orange-500/40 data-[hover=true]:bg-orange-600',

            // 3. Danger - Custom styling or override
            danger: 'bg-red-500 text-white hover:shadow-xs shadow-red-500/40 data-[hover=true]:bg-red-600',

            // 4. Success - Custom styling or override
            success:
                'bg-green-500 text-white hover:shadow-xs shadow-green-500/40 data-[hover=true]:bg-green-600',
        },
        size: {
            xs: 'px-2 min-w-6 h-6 text-tiny gap-1 rounded-small',
        },
    },
    defaultVariants: {
        color: 'primary', // Set default to our new custom variant
    },
})
