import { NumberInput, extendVariants } from '@heroui/react'

export const HeroNumberInput = extendVariants(NumberInput, {
    variants: {
        variant: {
            minimal: {
                inputWrapper: [
                    'shadow-none',
                    'border',
                    'border-text-muted', // Matches your custom Tailwind color
                    '!bg-background',
                    'transition',
                    'duration-100',
                    'focus-within:border-primary',
                    'data-[hover=true]:border-primary',
                ],
                label: ['text-text-7!', 'font-medium'],
                input: [
                    'text-base',
                    'text-foreground',
                    'placeholder:text-default-300',
                ],
            },
        },
    },
    defaultVariants: {
        variant: 'minimal',
        labelPlacement: 'inside',
    },
})
