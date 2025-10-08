'use client'

import React, { useState } from 'react'
import { formatCurrencyVND } from '@/lib/formatCurrency'
import { cn } from '@/lib/utils'

type Props = {
    value: number | string
    defaultType: 'vi' | 'en'
    className?: string
}

export default function SwitchCurrency({
    value,
    defaultType = 'vi',
    className,
}: Props) {
    const [type] = useState<'vi' | 'en'>(defaultType)

    return (
        <p
            className={cn('font-bold text-right text-[#252b5b]', className)}
            onClick={() => {
                // if (type === 'en') {
                // 	setType('vi')
                // } else {
                // 	setType('en')
                // }
            }}
        >
            {formatCurrencyVND(
                value,
                type === 'vi' ? 'vi-VN' : 'en-US',
                type === 'vi' ? 'VND' : 'USD'
            )}
        </p>
    )
}
