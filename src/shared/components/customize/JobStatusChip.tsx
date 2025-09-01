'use client'

import React from 'react'
import { JobStatus } from '@/validationSchemas/job.schema'
import { cn, lightenHexColor } from '@/lib/utils'
import { Chip, ChipProps } from '@heroui/react'

type Props = {
    data: JobStatus
    classNames?: ChipProps['classNames']
    props?: ChipProps
}

export default function JobStatusChip({ data, classNames, props }: Props) {
    return (
        <Chip
            style={{
                color: data?.color,
                backgroundColor: lightenHexColor(data?.color ?? '#ffffff', 85),
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
            {data?.title}
        </Chip>
    )
}
