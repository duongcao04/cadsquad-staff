import React from 'react'

import FileManager from './_components/FileManager'

export default function DocumentsPage() {
    return (
        <div
            className="h-full p-3"
            style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
        >
            <FileManager />
        </div>
    )
}
