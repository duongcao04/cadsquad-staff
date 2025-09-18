'use client'

import React from 'react'

import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'

export default function AntdProvider({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AntdRegistry>
            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            headerBg: 'hsl(0,0%,97%)',
                        },
                        Tabs: {
                            horizontalMargin: '0',
                        },
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
                drawer={{
                    classNames: {
                        wrapper: '!p-2.5 !shadow-none',
                        content: 'rounded-lg shadow-lg',
                        body: '!py-3 !px-5',
                    },
                    styles: {
                        header: {
                            paddingInline: 16,
                            paddingBlock: 12,
                        },
                    },
                }}
                modal={{
                    classNames: {
                        content: 'shadow-lg',
                    },
                    style: {
                        top: 80,
                    },
                    styles: {
                        mask: {
                            background: '#000000c0',
                        },
                        content: {
                            borderRadius: '24px',
                        },
                    },
                }}
                select={{
                    style: {
                        MozOutlineRadius: 10,
                    },
                    styles: {
                        root: { borderStartStartRadius: 10 },
                    },
                    classNames: {
                        root: '!rounded-2xl',
                    },
                }}
            >
                {children}
            </ConfigProvider>
        </AntdRegistry>
    )
}
