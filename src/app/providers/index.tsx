'use client'

import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { NextIntlClientProvider } from 'next-intl'
import { SWRConfig } from 'swr'

import { localStorageProvider } from '@/lib/swr/provider'
import TanstackQueryProvider from './TanstackQueryProvider'
import AntdProvider from './AntdProvider'

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
            <AntdProvider>
                <HeroUIProvider>
                    <TanstackQueryProvider>
                        <SWRConfig value={{ provider: localStorageProvider }}>
                            <ToastProvider
                                placement="bottom-center"
                                regionProps={{
                                    classNames: {
                                        base: '!z-[10000]',
                                    },
                                }}
                            />
                            {children}
                        </SWRConfig>
                    </TanstackQueryProvider>
                </HeroUIProvider>
            </AntdProvider>
        </NextIntlClientProvider>
    )
}
