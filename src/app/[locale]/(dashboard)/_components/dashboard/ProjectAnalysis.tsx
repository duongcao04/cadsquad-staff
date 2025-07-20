'use client'

import React, { useMemo } from 'react'

import useSWR from 'swr'

import { formatCurrencyVND } from '@/lib/formatCurrency'
import { getProjects } from '@/lib/swr/actions/project'
import { PROJECT_API } from '@/lib/swr/api'
import { IconActive } from '@/shared/components/icons/solar/IconActive'
import { IconAssignee } from '@/shared/components/icons/solar/IconAssignee'
import { IconCompleted } from '@/shared/components/icons/solar/IconCompleted'
import { IconDueSoon } from '@/shared/components/icons/solar/IconDueSoon'
import { IconMoneyIncome } from '@/shared/components/icons/solar/IconMoneyIncome'

export default function ProjectAnalysis() {
    const { data: projects } = useSWR(PROJECT_API, () => getProjects())

    const analysis = useMemo(() => {
        return [
            {
                title: 'Assigned projects',
                value: `${projects?.length}`,
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
    }, [projects])

    return (
        <div className="grid grid-cols-5 gap-4">
            {analysis.map((item, index) => {
                return (
                    <div
                        key={index}
                        className="border border-border py-5 px-6 rounded-xl shadow-sm flex items-start justify-between gap-3"
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
