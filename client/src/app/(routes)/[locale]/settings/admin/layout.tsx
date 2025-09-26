import React from 'react'
import AdminSettingSidebar from './_components/AdminSettingSidebar'

type Props = { children: React.ReactNode }
export default async function AdminSettingLayout({ children }: Props) {
    return (
        <div className="w-screen h-screen grid grid-cols-[300px_1fr] gap-10">
            <AdminSettingSidebar />
            <div className="w-full">{children}</div>
        </div>
    )
}
