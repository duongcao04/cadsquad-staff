import { Suspense } from 'react'

import '@ant-design/v5-patch-for-react-19'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

import '@/app/globals.css'
import { AppProvider } from '@/app/providers'
import { SupportLanguages, routing } from '@/i18n/routing'

import { GlassBackground } from '@/shared/components'
import AppLoader from './loading'

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode
    params: Promise<{ locale: string }>
}>) {
    // Get locale and check if it's valid
    const { locale } = await params

    // Validate locale - sử dụng notFound() thay vì NotFound()
    if (!routing.locales.includes(locale as SupportLanguages)) {
        notFound() // Gọi function này sẽ trigger 404 page
    }

    // Sử dụng getMessages từ next-intl/server
    // Nó sẽ tự động sử dụng config từ request.ts
    const messages = await getMessages()

    return (
        <AppProvider key="root" locale={locale} messages={messages}>
            <Suspense fallback={<AppLoader />}>
                <GlassBackground>{children}</GlassBackground>
            </Suspense>
        </AppProvider>
    )
}
