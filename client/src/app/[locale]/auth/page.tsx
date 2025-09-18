import React from 'react'

import CadsquadLogo from '@/shared/components/CadsquadLogo'

import LoginForm from './_components/LoginForm'

export default function AuthPage() {
    return (
        <div className="w-screen h-screen overflow-hidden flex items-center justify-center flex-col gap-8 bg-gradient-to-r from-[#f3f3c3] to-[#D4D3DD]">
            <CadsquadLogo
                classNames={{
                    logo: 'w-64',
                }}
            />
            <LoginForm />
        </div>
    )
}
