'use client'

import React from 'react'
import UpdateAccountForm from './_components/UpdateAccountForm'
import useAuth from '@/shared/queries/useAuth'

export default function SettingAccountPage() {
    const {
        profile: { isLoading },
    } = useAuth()

    return (
        <div className="w-full mt-4 space-y-6">
            <h1 className="text-xl font-semibold">
                Cập nhật thông tin tài khoản
            </h1>
            <UpdateAccountForm isLoading={isLoading} />
        </div>
    )
}
