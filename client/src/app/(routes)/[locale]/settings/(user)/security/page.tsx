'use client'

import React from 'react'
import ChangePasswordForm from './_components/ChangePasswordForm'
import { Skeleton } from 'antd'
import useAuth from '@/shared/queries/useAuth'

export default function SecurityPage() {
    const {
        profile: { isLoading },
    } = useAuth()

    return (
        <div className="w-full mt-4 space-y-6">
            <h1 className="text-xl font-semibold">Đăng nhập và bảo mật</h1>
            {isLoading && (
                <Skeleton className="w-full h-[400px] rounded-xl"></Skeleton>
            )}
            {!isLoading && <ChangePasswordForm />}
        </div>
    )
}
