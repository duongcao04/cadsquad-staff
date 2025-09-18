'use client'

import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { NextIntlClientProvider } from 'next-intl'

import TanstackQueryProvider from './TanstackQueryProvider'
import AntdProvider from './AntdProvider'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

type Props = {
    children: React.ReactNode
    locale: string
    messages: Record<string, unknown>
}
export function AppProvider({ children, locale, messages }: Props) {
    return (
        <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone="Asia/Ho_Chi_Minh"
        >
            <NextThemesProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={true}
            >
                <AntdProvider>
                    <HeroUIProvider>
                        <TanstackQueryProvider>
                            <ToastProvider
                                placement="bottom-center"
                                regionProps={{
                                    classNames: {
                                        base: '!z-[10000]',
                                    },
                                }}
                            />
                            {children}
                        </TanstackQueryProvider>
                    </HeroUIProvider>
                </AntdProvider>
            </NextThemesProvider>
        </NextIntlClientProvider>
    )
}
