'use client'

import { useMemo } from 'react'

import { formatCurrencyVND } from '@/lib/formatCurrency'
import {
    IconActive,
    IconAssignee,
    IconCompleted,
    IconDueSoon,
    IconMoneyIncome,
} from '@/shared/components'
import { useJobs } from '@/shared/queries'

export default function ProjectAnalysis() {
    const { jobs } = useJobs()

    const analysis = useMemo(() => {
        return [
            {
                title: 'Assigned projects',
                value: `${jobs?.length}`,
                icon: IconAssignee,
                color: '#c65808',
                href: '',
            },
            {
                title: 'Active projects',
                value: '20',
                icon: IconActive,
                color: '#08c611',
                href: '',
            },
            {
                title: 'Due Soon',
                value: '15',
                icon: IconDueSoon,
                color: '#b9c608',
                href: '',
            },
            {
                title: 'Completed',
                value: '20',
                icon: IconCompleted,
                color: '#c60837',
                href: '',
            },
            {
                title: 'Monthly income',
                value: formatCurrencyVND(200000, 'vi-VN'),
                icon: IconMoneyIncome,
                color: '#083bc6',
                href: '',
            },
        ]
    }, [jobs])

    return (
        <div className="grid grid-cols-5 gap-4">
            {analysis.map((item, index) => {
                return (
                    <div
                        key={index}
                        className="border border-border py-5 px-6 rounded-xl flex items-start justify-between gap-3"
                        style={{
                            boxShadow:
                                'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                        }}
                    >
                        <div>
                            <p className="capitalizea text-sm font-medium">
                                {item?.title}
                            </p>
                            <p className="mt-2 font-medium text-3xl">
                                {item?.value}
                            </p>
                        </div>
                        <div className="mt-3 p-1.5 bg-border rounded-full">
                            <item.icon
                                className="size-7"
                                style={{ color: item.color }}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
