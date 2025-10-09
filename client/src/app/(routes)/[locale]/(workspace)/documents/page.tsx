'use client'

import React from 'react'

import FileManager from '@/shared/components/FileManager'
import { useSearchParam } from '@/shared/hooks/useSearchParam'

import { DOCUMENTS_DIR } from './actions'

export default function DocumentsPage() {
    const { getSearchParam } = useSearchParam()
    const dirQuery = getSearchParam('directory') ?? DOCUMENTS_DIR

    return (
        <div
            className="h-full p-3"
            style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
        >
            <FileManager defaultDirectory={dirQuery} />
        </div>
    )
}
