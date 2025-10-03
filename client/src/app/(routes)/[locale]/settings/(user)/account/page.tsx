import React from 'react'
import UpdateAccountForm from './_components/UpdateAccountForm'

export default function SettingAccountPage() {
    return (
        <div className="w-full mt-4 space-y-6">
            <h1 className="text-xl font-semibold">
                Cập nhật thông tin tài khoản
            </h1>
            <UpdateAccountForm />
        </div>
    )
}
