'use client'

import React from 'react'

import { Image } from 'antd'

import useAuth from '@/shared/queries/useAuth'
import ProfileTabs from './profile-tabs'

export default function ProfileCard() {
    const { profile } = useAuth()

    return (
        <>
            <div className="text-center py-6">
                <Image
                    src={String(profile?.avatar)}
                    alt={profile?.displayName}
                    rootClassName="!size-32 !rounded-full"
                    className="!size-full !rounded-full"
                />
                <h2 className="mt-4 font-medium text-2xl">
                    {profile?.displayName ? profile?.displayName : '-'}
                </h2>
            </div>

            <ProfileTabs />
        </>
    )
}
