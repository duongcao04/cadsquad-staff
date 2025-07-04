import React from 'react'

import ProjectTable from './_components/ProjectTable'
import TableHeading from './_components/TableHeading'

export default function OnboardingPage() {
    return (
        <div
            className="p-3"
            style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
        >
            <TableHeading />
            <ProjectTable />
        </div>
    )
}
