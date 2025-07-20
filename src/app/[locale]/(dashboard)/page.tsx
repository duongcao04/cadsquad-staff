import React from 'react'

import CalendarManage from './_components/dashboard/CalendarManage'
import ProjectAnalysis from './_components/dashboard/ProjectAnalysis'
import ProjectManage from './_components/dashboard/ProjectManage'
import SayHi from './_components/dashboard/SayHi'

export default function DashboardIndexPage() {
    return (
        <div className="gap-2 h-full px-1 py-2">
            <div className="">
                <SayHi />
                <div className="h-6" />
                <ProjectAnalysis />
            </div>
            <div className="mt-5 grid grid-cols-[1.5fr_0.5fr] gap-5">
                <ProjectManage />
                <CalendarManage />
            </div>
        </div>
    )
}
