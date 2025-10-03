'use client'
import { Tab, Tabs } from '@heroui/react'
import React from 'react'
import ProfileOverview from './ProfileOverview'
import ProfileOrganization from './ProfileOrganization'
import useAuth from '@/shared/queries/useAuth'
import { Building2, UserRound } from 'lucide-react'

export default function ProfileTabs() {
    const { profile } = useAuth()
    return (
        <Tabs key="profile-tabs" aria-label="Profile tabs" fullWidth>
            <Tab
                key="overview"
                title={
                    <div className="flex items-center space-x-2">
                        <UserRound size={16} />
                        <span>Overview</span>
                    </div>
                }
            >
                <ProfileOverview data={profile} />
            </Tab>
            <Tab
                key="organization"
                title={
                    <div className="flex items-center space-x-2">
                        <Building2 size={16} />
                        <span>Organization</span>
                    </div>
                }
            >
                <ProfileOrganization />
            </Tab>
        </Tabs>
    )
}
