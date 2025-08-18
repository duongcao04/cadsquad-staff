'use client'
import { Input } from '@heroui/react'
import { Search } from 'lucide-react'
import React, { useState } from 'react'

export default function SettingsPage() {
    const [keywords, setKeywords] = useState('')
    return (
        <div className="w-full mt-4 space-y-3">
            <h1 className="text-xl font-semibold">Find the setting you need</h1>

            <Input
                value={keywords}
                startContent={<Search size={18} className="text-text-fore2" />}
                onChange={(event) => {
                    const value = event.target.value
                    setKeywords(value)
                }}
                classNames={{
                    base: 'max-w-[700px]',
                }}
                placeholder="Tìm kiếm cài đặt"
            />
            {keywords && (
                <div className="mt-10">
                    <h2 className="text-xl font-semibold">Search result:</h2>
                    <p className="mt-0.5 text-sm">
                        Settings that match your search for {`"${keywords}"`}
                    </p>
                </div>
            )}
        </div>
    )
}
