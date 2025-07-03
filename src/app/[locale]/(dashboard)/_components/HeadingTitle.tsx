'use client'

import React, { useEffect, useState } from 'react'

export default function HeadingTitle() {
    const [title, setTitle] = useState('')

    useEffect(() => {
        setTitle(
            document.title.includes('|')
                ? document.title.split('|')[0]
                : document.title
        )
    }, [])

    return (
        <p className="align-middle uppercase font-saira font-medium text-2xl">
            {title}
        </p>
    )
}
