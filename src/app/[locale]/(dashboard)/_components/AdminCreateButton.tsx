'use client'

import React from 'react'

import { Button } from '@heroui/react'
import { PlusIcon } from 'lucide-react'

export default function AdminCreateButton() {
    return (
        <Button
            startContent={<PlusIcon />}
            className="rounded-full bg-gradient-to-br from-secondary-600 via-secondary-500 to-secondary-400 pr-10 text-white"
        >
            Create
        </Button>
    )
}
