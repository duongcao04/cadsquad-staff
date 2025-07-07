'use client'

import { AntdRegistry } from '@ant-design/nextjs-registry'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { ConfigProvider } from 'antd'
import { NextIntlClientProvider } from 'next-intl'

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
                    <ConfigProvider
                        theme={{
                            components: {
                                Select: {
                                    selectorBg: '#f4f4f5',
                                    optionSelectedColor: '#1b1464',
                                    activeBorderColor: '#1b1464',
                                    hoverBorderColor: '#1b1464',
                                    borderRadiusLG: 12,
                                },
                                DatePicker: {
                                    colorBgContainer: '#f4f4f5',
                                    activeBorderColor: '#1b1464',
                                    hoverBorderColor: '#1b1464',
                                    borderRadiusLG: 12,
                                },
                            },
                        }}
                    >
                        {children}
                    </ConfigProvider>
                </AntdRegistry>
            </HeroUIProvider>
        </NextIntlClientProvider>
    )
}
