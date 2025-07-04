'use client'

import React from 'react'

import { Card } from 'antd'

import ProjectTable from '../onboarding/_components/ProjectTable'
import TableHeading from '../onboarding/_components/TableHeading'
import ProfileCard from './_components/ProfileCard'

export default function ProfilePage() {
    return (
        <div className="size-full grid grid-cols-[0.25fr_1fr] gap-5 bg-">
            {/* Left Panel - User Profile */}
            <div className="w-full flex items-start justify-center">
                <ProfileCard />
            </div>

            {/* Right Panel - Job Dashboard */}
            <Card
                style={{
                    flex: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
            >
                <TableHeading />
                <ProjectTable />
            </Card>
        </div>
    )
}
