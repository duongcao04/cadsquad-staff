import React from 'react'

import { Avatar, Card, Tabs, TabsProps } from 'antd'

import { useAuthStore } from '@/lib/zustand/useAuthStore'

import ProfileOrganization from './profile-tabs/ProfileOrganization'
import ProfileOverview from './profile-tabs/ProfileOverview'

export default function ProfileCard() {
    const userProfile = useAuthStore((state) => state.authUser)

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Overview',
            children: <ProfileOverview />,
        },
        {
            key: '2',
            label: 'Organization',
            children: <ProfileOrganization />,
        },
    ]
    return (
        <Card
            style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            className="w-full"
        >
            <div className="text-center">
                <Avatar size={160} src={userProfile?.avatar} />
                <h2 className="mt-4 font-medium font-saira text-2xl">
                    {userProfile?.name}
                </h2>
            </div>

            <Tabs defaultActiveKey="1" items={tabItems} />
        </Card>
    )
}
