import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { memo } from 'react'
import CSDWhiteLogo from '../../assets/logo-white.webp'
import CSDLogo from '../../assets/logo.webp'

type Props = {
    canRedirect?: boolean
    href?: string
    classNames?: {
        root?: string
        logo?: string
    }
    logoTheme?: 'white' | 'default'
}

function CadsquadLogo({
    logoTheme = 'default',
    canRedirect = true,
    href = '/',
    classNames,
}: Props) {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        const wrapperClassName = cn('block w-fit', classNames?.root)
        return canRedirect ? (
            <Link to={href} className={wrapperClassName}>
                {children}
            </Link>
        ) : (
            <div className={wrapperClassName}>{children}</div>
        )
    }

    return (
        <Wrapper>
            <img
                src={logoTheme === 'default' ? CSDLogo : CSDWhiteLogo}
                alt="CSD Logo"
                className={cn('object-contain w-fit', classNames?.logo)}
            />
        </Wrapper>
    )
}
export default memo(CadsquadLogo)
