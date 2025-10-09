'use client'

import { useProfile } from '@/shared/queries'
import { Skeleton } from 'antd'
import { useTranslations } from 'next-intl'
import { EditAppearanceForm } from './shared'

export default function AppearancePage() {
    const t = useTranslations()
    const { isLoading: loadingProfile } = useProfile()

    return (
        <div className="w-full mt-4 space-y-6">
            <div>
                <h1 className="text-xl font-semibold">{t('appearance')}</h1>
                <p className="mt-1 text-sm text-text2">{t('appearanceDesc')}</p>
            </div>
            {loadingProfile && (
                <Skeleton className="w-full h-[400px] rounded-xl"></Skeleton>
            )}
            {!loadingProfile && <EditAppearanceForm />}
        </div>
    )
}
