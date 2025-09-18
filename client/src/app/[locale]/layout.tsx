import { Suspense } from 'react'

import '@ant-design/v5-patch-for-react-19'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

import '@/app/globals.css'
import { AppProvider } from '@/app/providers'
import { geistMono, geistSans, quicksand, saira } from '@/fonts'
import { SupportLanguages, routing } from '@/i18n/routing'

import AppLoader from './loading'
import GlassBackground from '../../shared/components/ui/GlassBackground'

export default async function RootLayout({
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
        <html lang={locale} suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${saira.variable} ${quicksand.variable} antialiased`}
                suppressHydrationWarning
            >
                <AppProvider key="root" locale={locale} messages={messages}>
                    <Suspense fallback={<AppLoader />}>
                        <GlassBackground>{children}</GlassBackground>
                    </Suspense>
                </AppProvider>
            </body>
        </html>
    )
}
