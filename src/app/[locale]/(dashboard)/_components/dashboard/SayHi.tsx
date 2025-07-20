'use client'

import React from 'react'

import { useAuthStore } from '@/lib/zustand/useAuthStore'

export default function SayHi() {
    const { authUser } = useAuthStore()
    return (
        <h2 className="text-2xl font-semibold text-gray-800">
            Hi, {authUser?.name}!
        </h2>
    )
}
