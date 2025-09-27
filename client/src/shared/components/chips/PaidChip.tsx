'use client'

import React from 'react'
import { cn, lightenHexColor } from '@/lib/utils'
import { Chip, ChipProps } from '@heroui/react'

const paidStatus = {
    paid: {
        title: 'Paid',
        hexColor: '#2a9174',
    },
    unpaid: {
        title: 'Unpaid',
        hexColor: '#f83640',
    },
}

type Props = {
    status: 'paid' | 'unpaid'
    classNames?: ChipProps['classNames']
    props?: ChipProps
}
export default function PaidChip({ status, classNames, props }: Props) {
    return (
        <Chip
            style={{
                color: paidStatus[status]?.hexColor
                    ? paidStatus[status].hexColor
                    : '#ffffff',
                backgroundColor: lightenHexColor(
                    paidStatus[status]?.hexColor
                        ? paidStatus[status].hexColor
                        : '#ffffff',
                    90
                ),
                border: '1px solid',
                borderColor: paidStatus[status]?.hexColor
                    ? paidStatus[status].hexColor
                    : '#ffffff',
            }}
            variant="solid"
            classNames={{
                ...classNames,
                content: cn(
                    'text-xs font-semibold font-saira',
                    classNames?.content
                ),
            }}
            {...props}
        >
            {paidStatus[status].title}
        </Chip>
    )
}
