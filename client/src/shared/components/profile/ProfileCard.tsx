'use client'

import { Image } from 'antd'

import { optimizeCloudinary } from '@/lib/cloudinary'
import { useProfile } from '@/lib/queries'
import { Divider, Tab, Tabs } from '@heroui/react'
import { Building2, UserRound } from 'lucide-react'
import { HeroCard, HeroCardBody, HeroCardHeader } from '../ui/hero-card'
import { ProfileOrganization } from './ProfileOrganization'
import { ProfileOverview } from './ProfileOverview'

export function ProfileCard() {
    const { profile } = useProfile()

    return (
        <HeroCard className="h-fit">
            <HeroCardHeader className="py-6 flex flex-col items-center">
                <Image
                    src={optimizeCloudinary(profile.avatar, {
                        width: 256,
                        height: 256,
                    })}
                    alt={profile?.displayName}
                    rootClassName="!size-32 !rounded-full"
                    className="size-full! rounded-full! object-cover"
                />
                <h2 className="mt-4 font-bold text-2xl text-text-default!">
                    {profile?.displayName ? profile?.displayName : '-'}
                </h2>
                <p className="text-text-subdued font-normal text-sm">
                    @{profile.username}
                </p>
            </HeroCardHeader>
            <Divider />
            <HeroCardBody>
                <Tabs key="profile-tabs" aria-label="Profile tabs" fullWidth>
                    <Tab
                        key="overview"
                        title={
                            <div className="flex items-center space-x-2">
                                <UserRound size={16} />
                                <span>Overview</span>
                            </div>
                        }
                        className="px-2"
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
                        className="px-5"
                    >
                        <ProfileOrganization />
                    </Tab>
                </Tabs>
            </HeroCardBody>
        </HeroCard>
    )
}
