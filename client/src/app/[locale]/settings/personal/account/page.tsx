'use client'

import React from 'react'
import UpdateAccountForm from './_components/UpdateAccountForm'
import useAuth from '@/queries/useAuth'
import { Skeleton } from '@heroui/react'

export default function SettingAccountPage() {
    const {
        profile: { isLoading },
    } = useAuth()

    return (
        <div className="w-full mt-4 space-y-6">
            <h1 className="text-xl font-semibold">
                Cập nhật thông tin tài khoản
            </h1>
            {isLoading && (
                <Skeleton className="w-full h-[400px] rounded-xl"></Skeleton>
            )}
            {!isLoading && <UpdateAccountForm />}
        </div>
    )
}
