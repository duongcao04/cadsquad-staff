'use client'

import React from 'react'
import Timmer from './Timmer'
import { cn } from '@/lib/utils'

type Props = {
    title: React.ReactNode
    classNames?: {
        wrapper?: string
    }
}
export function PageHeading({ title, classNames }: Props) {
    return (
        <div
            className={cn(
                'w-full pt-2 pb-1 flex items-center justify-between',
                classNames?.wrapper
            )}
        >
            <h1 className="align-middle font-medium text-xl">{title}</h1>
            <Timmer />
        </div>
    )
}
