'use client'

import React from 'react'
import { PageHeading } from '..'
import { Badge } from '@heroui/react'
import { useTranslations } from 'next-intl'

export default function ManageTeamHeading() {
    const t = useTranslations()
    return (
        <PageHeading
            title={
                <Badge color="danger" content="5">
                    <p className="pr-5 leading-none">
                        {t('settings.teamManagement')}
                    </p>
                </Badge>
            }
            classNames={{
                wrapper: '!py-3 pl-6 pr-3.5',
            }}
        />
    )
}
