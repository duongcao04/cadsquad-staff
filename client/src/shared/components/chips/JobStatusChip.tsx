'use client'

import { cn, lightenHexColor } from '@/lib/utils'
import { JobStatus } from '@/shared/interfaces'
import { Chip, ChipProps } from '@heroui/react'
import React from 'react'

type Props = {
    data: JobStatus
    classNames?: ChipProps['classNames']
    props?: ChipProps
    childrenRender?: (status: JobStatus) => React.ReactNode
}
export function JobStatusChip({
    data,
    classNames,
    props,
    childrenRender,
}: Props) {
    return (
        <Chip
            style={{
                color: data?.hexColor ? data.hexColor : '#ffffff',
                backgroundColor: lightenHexColor(
                    data?.hexColor ? data.hexColor : '#ffffff',
                    90
                ),
                border: '1px solid',
                borderColor: data?.hexColor ? data.hexColor : '#ffffff',
            }}
            variant="solid"
            classNames={{
                ...classNames,
                content: cn(
                    'uppercase text-xs font-semibold font-saira',
                    classNames?.content
                ),
            }}
            {...props}
        >
            {!childrenRender ? data?.displayName : childrenRender(data)}
        </Chip>
    )
}
