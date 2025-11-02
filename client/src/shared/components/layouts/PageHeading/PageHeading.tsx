'use client'

import { cn } from '@/lib/utils'
import React from 'react'
import Timmer from './Timmer'

type Props = {
    breadcrumbs?: React.ReactNode
    title: React.ReactNode
    description?: string
    classNames?: {
        wrapper?: string
    }
}
export function PageHeading({
    title,
    classNames,
    breadcrumbs,
    description,
}: Props) {
    return (
        <div className={cn('w-full pt-3 pb-5', classNames?.wrapper)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                    <h1 className="align-middle font-medium text-2xl">
                        {title}
                    </h1>
                    {breadcrumbs && (
                        <div className="h-full flex items-end justify-start text-text-muted">
                            <div className="w-[1px] h-5 ml-8 mr-6 bg-text-disabled"></div>
                            {breadcrumbs}
                        </div>
                    )}
                </div>
                <Timmer />
            </div>
            {description && (
                <p className="text-text-6 text-base">{description}</p>
            )}
        </div>
    )
}
