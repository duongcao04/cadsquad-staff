'use client'

import React from 'react'

import Image from 'next/image'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import CSDWhiteLogo from '../../../public/logo-white.webp'
import CSDLogo from '../../../public/logo.webp'
import { useTheme } from 'next-themes'

type Props = {
    canRedirect?: boolean
    href?: string
    classNames?: {
        root?: string
        logo?: string
    }
    logoTheme?: 'white' | 'default'
}

export default function CadsquadLogo({
    logoTheme = 'default',
    canRedirect = true,
    href = '/',
    classNames,
}: Props) {
    const { theme, systemTheme } = useTheme()

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        const wrapperClassName = cn('block w-fit', classNames?.root)
        return canRedirect ? (
            <Link href={href} className={wrapperClassName}>
                {children}
            </Link>
        ) : (
            <div className={wrapperClassName}>{children}</div>
        )
    }

    if (theme === 'light') {
        logoTheme = 'default'
    } else {
        if (systemTheme === 'light') {
            logoTheme = 'default'
        } else {
            logoTheme = 'white'
        }
    }

    return (
        <Wrapper>
            <Image
                src={logoTheme === 'default' ? CSDLogo : CSDWhiteLogo}
                alt="CSD Logo"
                className={cn('object-contain w-fit', classNames?.logo)}
                quality={100}
                suppressHydrationWarning
            />
        </Wrapper>
    )
}
