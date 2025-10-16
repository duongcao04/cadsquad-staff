'use client'

import '@ant-design/v5-patch-for-react-19'

import '@/app/globals.css'
import { geistMono, geistSans, quicksand, saira } from '@/fonts'
import { UseSocketOnBoot } from '@/shared/hooks/useSocketOnBoot'
import PushSubscriber from '@/shared/components/PushSubscriber'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    UseSocketOnBoot()
    return (
        <html suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${saira.variable} ${quicksand.variable} antialiased`}
                suppressHydrationWarning
            >
                <PushSubscriber />
                {children}
            </body>
        </html>
    )
}
