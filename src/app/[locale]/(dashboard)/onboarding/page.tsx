import React from 'react'

import ProjectTable from './_components/ProjectTable'

export default function OnboardingPage() {
    return (
        <div
            className="p-3 h-full"
            style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
        >
            <ProjectTable />
        </div>
    )
}
