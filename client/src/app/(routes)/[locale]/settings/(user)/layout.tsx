import React from 'react'
import SettingSidebar from './_components/SettingSidebar'

type Props = { children: React.ReactNode }
export default async function PersonalSettingLayout({ children }: Props) {
    return (
        <div className="w-full grid grid-cols-[300px_1fr] gap-10">
            <SettingSidebar />
            <div className="max-w-[900px]">{children}</div>
        </div>
    )
}
