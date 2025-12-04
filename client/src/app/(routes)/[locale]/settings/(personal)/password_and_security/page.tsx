'use client'

import { useProfile } from '@/lib/queries'
import { ChangePasswordForm } from '@/shared/components/personal-settings/ChangePasswordForm'
import { Skeleton } from 'antd'

export default function SecurityPage() {
    const { isLoading } = useProfile()

    return (
        <div className="w-full p-4 space-y-6 max-w-[900px]">
            <h1 className="text-xl font-semibold">Đăng nhập và bảo mật</h1>
            {isLoading && (
                <Skeleton className="w-full h-[400px] rounded-xl"></Skeleton>
            )}
            {!isLoading && <ChangePasswordForm />}
        </div>
    )
}
