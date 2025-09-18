'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from '@/i18n/navigation'

export default function HeadingTitle() {
    const pathname = usePathname()
    const [title, setTitle] = useState('')

    useEffect(() => {
        setTitle(
            document.title.includes('|')
                ? document.title.split('|')[0]
                : document.title
        )
    }, [pathname])

    return <p className="align-middle font-medium text-lg">{title}</p>
}
