'use client'

import { AntdRegistry } from '@ant-design/nextjs-registry'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { ConfigProvider } from 'antd'
import { NextIntlClientProvider } from 'next-intl'
import { SWRConfig } from 'swr'

import { localStorageProvider } from '@/lib/swr/provider'
import { theme } from '@/styles/antd.config'

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
            <HeroUIProvider>
                <ToastProvider placement="bottom-center" />
                <AntdRegistry>
                    <ConfigProvider theme={theme}>
                        <SWRConfig value={{ provider: localStorageProvider }}>
                            {children}
                        </SWRConfig>
                    </ConfigProvider>
                </AntdRegistry>
            </HeroUIProvider>
        </NextIntlClientProvider>
    )
}
