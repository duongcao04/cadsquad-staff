import { extendVariants, Button } from '@heroui/react'

export const HeroButton = extendVariants(Button, {
    variants: {
        variant: {
            bordered:
                'border-1 !bg-background hover:bg-primary-50 shadow-none data-[hover=true]:border-primary transition duration-100',
        },
    },
    defaultVariants: {
        variant: 'bordered',
        size: 'sm',
    },
})
