'use client'

import { Link } from '@tanstack/react-router'
import React from 'react'

import { cn } from '@/lib/utils'

import CSDLogo from '../../assets/logo.webp'
import CSDWhiteLogo from '../../assets/logo-white.webp'

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
export default React.memo(CadsquadLogo)
