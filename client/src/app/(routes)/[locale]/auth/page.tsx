import { CadsquadLogo } from '@/shared/components'
import { LoginForm } from './shared'

export default function AuthPage() {
    return (
        <div className="w-screen h-screen overflow-hidden flex items-center justify-center flex-col gap-8 bg-gradient-to-r from-[#f3f3c3] to-[#D4D3DD]">
            <CadsquadLogo
                classNames={{
                    logo: 'w-64',
                }}
                logoTheme="default"
            />
            <LoginForm />
        </div>
    )
}
