'use client'

import { formatCurrencyVND } from '@/lib/formatCurrency'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type Props = {
    value: number | string
    defaultType: 'vi' | 'en'
    className?: string
}

export function SwitchCurrency({
    value,
    defaultType = 'vi',
    className,
}: Props) {
    const [type] = useState<'vi' | 'en'>(defaultType)

    return (
        <p
            className={cn('font-bold text-right text-currency', className)}
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
