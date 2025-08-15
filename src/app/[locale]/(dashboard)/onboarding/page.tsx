import React from 'react'

import JobTable from './_components/JobTable'

export default function OnboardingPage() {
    return (
        <div
            className="size-full bg-text4 py-3 px-4"
            style={{
                boxShadow:
                    'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
                borderRadius: '20px',
            }}
        >
            <JobTable />
        </div>
    )
}
