'use client'

import { cn, lightenHexColor } from '@/lib/utils'
import { Chip, ChipProps } from '@heroui/react'

const userActiveStatus = {
    activated: {
        title: 'Activated',
        hexColor: '#589981',
    },
    unActivated: {
        title: 'UnActivated',
        hexColor: '#f32013',
    },
}

type Props = {
    status: 'activated' | 'unActivated'
    classNames?: ChipProps['classNames']
    props?: ChipProps
}
export function UserActiveChip({ status, classNames, props }: Props) {
    return (
        <Chip
            style={{
                color: userActiveStatus[status]?.hexColor
                    ? userActiveStatus[status].hexColor
                    : '#ffffff',
                backgroundColor: lightenHexColor(
                    userActiveStatus[status]?.hexColor
                        ? userActiveStatus[status].hexColor
                        : '#ffffff',
                    90
                ),
                border: '1px solid',
                borderColor: userActiveStatus[status]?.hexColor
                    ? userActiveStatus[status].hexColor
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
            {userActiveStatus[status].title}
        </Chip>
    )
}
