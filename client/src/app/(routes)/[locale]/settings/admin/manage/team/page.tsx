'use client'

import React from 'react'
import TeamTable from './_components/TeamTable'
import { useUsers } from '@/shared/queries/useUser'

export default function ManagementTeamPage() {
    const { data: users } = useUsers()
    return (
        <div className="size-full">
            <h1>Management User</h1>
            <TeamTable data={users ?? []} tableOptions={{ scroll: {} }} />
        </div>
    )
}
