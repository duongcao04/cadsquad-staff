'use client'

import CadsquadLogo from '@/shared/components/CadsquadLogo'
import {
    FeatureCard,
    FeatureCardProps,
} from '@/shared/components/settings/FeatureCard'
import { FeatureBoard } from '@/shared/components/settings/FutureBoard'
import { Button } from '@heroui/react'
import { useTranslations } from 'next-intl'

const FEATURE_BOARD_ACTIONS: FeatureCardProps[] = [
    {
        key: 'team',
        title: 'Team',
        description: 'Add or manage team',
        actions: [
            {
                key: 'addUser',
                title: 'Add a user',
            },
            {
                key: 'deleteUser',
                title: 'Delete a user',
            },
            {
                key: 'updateUser',
                title: 'Update a user information',
            },
        ],
    },
    {
        key: 'department',
        title: 'Department',
        description: 'Add or manage department',
        actions: [
            {
                key: 'addDepartment',
                title: 'Add a department',
            },
            {
                key: 'deleteDepartment',
                title: 'Delete a department',
            },
            {
                key: 'updateDepartment',
                title: 'Update a department information',
            },
        ],
    },
    {
        key: 'jobTitle',
        title: 'Job title',
        description: 'Add or manage Job title',
        actions: [
            {
                key: 'addJobTitle',
                title: 'Add a job title',
            },
            {
                key: 'deleteJobTitle',
                title: 'Delete a job title',
            },
            {
                key: 'updateJobTitle',
                title: 'Update a job title information',
            },
        ],
    },
    {
        key: 'payment',
        title: 'Payment',
        description: 'Add or manage Payment',
        actions: [
            {
                key: 'addPayment',
                title: 'Add a payment',
            },
            {
                key: 'deletePayment',
                title: 'Delete a payment',
            },
            {
                key: 'updatePayment',
                title: 'Update a payment information',
            },
        ],
    },
]

export default function AdminSettings() {
    const t = useTranslations()

    return (
        <div className="p-4 max-w-[1400px]">
            <div className="border-b-1 border-text-muted flex items-center justify-start gap-8 pt-3 pb-5">
                <CadsquadLogo
                    classNames={{
                        logo: '!h-16',
                    }}
                />
                <div>
                    <h1 className="text-2xl font-medium uppercase tracking-wide">
                        Cadsquad Vietnam
                    </h1>
                    <p className="mt-0.5 text-text-default">
                        {t('adminWelcome')}
                    </p>
                </div>
            </div>
            <FeatureBoard
                classNames={{
                    wrapper: 'mt-7 grid-cols-3',
                }}
            >
                {FEATURE_BOARD_ACTIONS.map((ac) => {
                    return (
                        <FeatureCard
                            key={ac.key}
                            title={ac.title}
                            description={ac.description}
                            actions={ac.actions}
                            actionButton={
                                <Button variant="light" color="primary">
                                    <span className="font-semibold text-sm">
                                        {t('manage')}
                                    </span>
                                </Button>
                            }
                        />
                    )
                })}
            </FeatureBoard>
        </div>
    )
}
