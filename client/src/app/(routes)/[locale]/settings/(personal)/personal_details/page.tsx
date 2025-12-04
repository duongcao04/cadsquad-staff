'use client'

import { UpdateAccountForm } from '@/shared/components/personal-settings/UpdateAccountForm'
import { useTranslations } from 'next-intl'

export default function SettingAccountPage() {
    const tSettings = useTranslations('settings')
    return (
        <div className="w-full p-4 space-y-6 max-w-[900px]">
            <h1 className="text-xl font-semibold">
                {tSettings('personalDetails')}
            </h1>
            <UpdateAccountForm />
        </div>
    )
}
