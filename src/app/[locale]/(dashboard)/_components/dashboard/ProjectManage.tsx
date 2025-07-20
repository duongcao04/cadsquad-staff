'use client'

import React from 'react'

import ProjectTable from '../../onboarding/_components/ProjectTable'

export default function ProjectManage() {
    return (
        <div
            className="p-3 rounded-3xl h-full border border-gray-100"
            style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
        >
            <ProjectTable />
        </div>
    )
}
