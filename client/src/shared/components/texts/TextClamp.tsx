'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

export function TextClamp({
    children,
    classNames,
}: {
    children: React.ReactNode
    classNames?: {
        wrapper?: string
        text?: string
        button?: string
    }
}) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div className={cn(classNames?.wrapper)}>
            <span
                className={cn(
                    `${expanded ? '' : 'line-clamp-2'}`,
                    classNames?.text
                )}
            >
                {children}{' '}
            </span>

            <button
                className={cn(
                    'inline-block text-sm font-medium hover:underline cursor-pointer text-text1p5',
                    classNames?.button
                )}
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? 'View less' : 'View more'}
            </button>
        </div>
    )
}
