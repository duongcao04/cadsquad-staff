import { cn } from '@/lib/utils'
import React from 'react'

export function FeatureBoard({
    children,
    classNames,
}: {
    children?: React.ReactNode
    classNames?: {
        wrapper?: string
    }
}) {
    return (
        <div className={cn('grid grid-cols-3 gap-5', classNames?.wrapper)}>
            {children}
        </div>
    )
}
