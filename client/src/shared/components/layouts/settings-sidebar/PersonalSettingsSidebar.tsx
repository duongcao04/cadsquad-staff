'use client'

import { useTranslations } from 'next-intl'
import { SETTING_SIDEBAR, SettingSidebar } from './SettingSidebar'

export function PersonalSettingSidebar() {
    const t = useTranslations('settings')
    return (
        <SettingSidebar title={t('settings')} sidebarData={SETTING_SIDEBAR} />
    )
}
