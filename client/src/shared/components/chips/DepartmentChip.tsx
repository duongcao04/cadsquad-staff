'use client'

import { cn, lightenHexColor } from '@/lib/utils'
import { Department } from '@/shared/interfaces'
import { Chip, ChipProps } from '@heroui/react'

type Props = {
    data: Department
    classNames?: ChipProps['classNames']
    props?: ChipProps
}
export function DepartmentChip({ data, classNames, props }: Props) {
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
                    'text-xs font-semibold font-saira',
                    classNames?.content
                ),
            }}
            {...props}
        >
            <div className="flex items-center justify-start gap-2 size-full">
                <div
                    className="w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: data?.hexColor || 'transparent',
                    }}
                />
                {data.displayName}
            </div>
        </Chip>
    )
}
