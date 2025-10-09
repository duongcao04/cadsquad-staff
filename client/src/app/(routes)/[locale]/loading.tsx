'use client'

import React from 'react'

import Image from 'next/image'

import { MotionDiv } from '@/lib/motion'

import CSDLogo from '../../../../public/logo.webp'
import WhiteCSDLogo from '../../../../public/logo-white.webp'
import '../../../styles/loading.css'
import { GlassBackground } from '@/shared/components'
import { useTheme } from 'next-themes'

export default function AppLoader() {
    const { theme, systemTheme } = useTheme()

    let logo = CSDLogo
    if (theme === 'light') {
        logo = CSDLogo
    } else {
        if (systemTheme === 'light') {
            logo = CSDLogo
        } else {
            logo = WhiteCSDLogo
        }
    }
    return (
        <GlassBackground>
            <MotionDiv
                className="w-screen h-screen max-w-screen max-h-screen overflow-hidden grid place-items-center"
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100vw', opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="loader"></div>
                <div className="absolute rounded-full">
                    <Image
                        src={logo}
                        alt="CSD Logo"
                        className="rounded-full max-w-[200px]"
                        quality={100}
                    />
                </div>
            </MotionDiv>
        </GlassBackground>
    )
}
