'use client'

import { useProfile } from '@/shared/queries'
import { Tab, Tabs } from '@heroui/react'
import { Building2, UserRound } from 'lucide-react'
import { ProfileOrganization } from './ProfileOrganization'
import { ProfileOverview } from './ProfileOverview'

export function ProfileTabs() {
    const { profile } = useProfile()
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
