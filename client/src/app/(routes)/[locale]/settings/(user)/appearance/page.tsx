'use client'

import React from 'react'
import { Skeleton } from 'antd'
import useAuth from '@/shared/queries/useAuth'
import EditAppearanceForm from './_components/EditAppearanceForm'

export default function AppearancePage() {
    const { loadingProfile } = useAuth()

    return (
        <div className="w-full mt-4 space-y-6">
            <div>
                <h1 className="text-xl font-semibold">Giao diện</h1>
                <p className="mt-1 text-sm text-text2">
                    Change how your public dashboard looks and feels
                </p>
            </div>
            {loadingProfile && (
                <Skeleton className="w-full h-[400px] rounded-xl"></Skeleton>
            )}
            {!loadingProfile && <EditAppearanceForm />}
        </div>
    )
}
