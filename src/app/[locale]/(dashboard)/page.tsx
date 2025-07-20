import React from 'react'

import CalendarManage from './_components/dashboard/CalendarManage'
import ProjectAnalysis from './_components/dashboard/ProjectAnalysis'
import ProjectManage from './_components/dashboard/ProjectManage'
import ProjectTimeline from './_components/dashboard/ProjectTimeline'

export default function DashboardIndexPage() {
    return (
        <div className="gap-2 h-full px-1 py-2 space-y-5">
            <ProjectAnalysis />
            <div className="grid grid-cols-[1.5fr_0.5fr] gap-5">
                <ProjectManage />
                <CalendarManage />
            </div>
            <ProjectTimeline />
        </div>
    )
}
