import React from 'react'
import UpdateAccountForm from './_components/UpdateAccountForm'
import { useTranslations } from 'next-intl'

export default function SettingAccountPage() {
    const tSettings = useTranslations('settings')
    return (
        <div className="w-full mt-4 space-y-6">
            <h1 className="text-xl font-semibold">
                {tSettings('personalDetails')}
            </h1>
            <UpdateAccountForm />
        </div>
    )
}
