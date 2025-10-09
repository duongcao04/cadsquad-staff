'use client'

import { useTranslations } from 'next-intl'
import { ADMIN_SIDEBAR } from '../actions'
import { SettingSidebar } from '../../../settings/shared'

export function AdminSettingSidebar() {
    const t = useTranslations('settings')
    return (
        <SettingSidebar
            title={t('adminSettings')}
            sidebarData={ADMIN_SIDEBAR}
        />
    )
}
