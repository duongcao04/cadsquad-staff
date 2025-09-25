import React from 'react'
import ProjectAnalysis from './_components/ProjectAnalysis'
import ProjectManage from './_components/ProjectManage'
import CalendarManage from './_components/CalendarManage'
import ProjectTimeline from './_components/ProjectTimeline'

export default function OverviewPage() {
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
