'use client'

import React from 'react'
import { cn, lightenHexColor } from '@/lib/utils'
import { Chip, ChipProps } from '@heroui/react'
import { JobStatus } from '@/shared/interfaces/jobStatus.interface'

type Props = {
    data: JobStatus
    classNames?: ChipProps['classNames']
    props?: ChipProps
}

export default function JobStatusChip({ data, classNames, props }: Props) {
    return (
        <Chip
            style={{
                color: data.hexColor,
                backgroundColor: lightenHexColor(
                    data?.hexColor ?? '#ffffff',
                    85
                ),
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
            {data.displayName}
        </Chip>
    )
}
