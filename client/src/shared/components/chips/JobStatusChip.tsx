'use client'

import React from 'react'
import { cn, lightenHexColor } from '@/lib/utils'
import { Chip, ChipProps } from '@heroui/react'
import { JobStatus } from '@/shared/interfaces/jobStatus.interface'

type Props = {
    data: JobStatus
    classNames?: ChipProps['classNames']
    props?: ChipProps
    childrenRender?: (status: JobStatus) => React.ReactNode
}
export default function JobStatusChip({
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
