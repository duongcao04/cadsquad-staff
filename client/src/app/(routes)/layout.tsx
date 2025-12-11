import '@ant-design/v5-patch-for-react-19'

import '@/styles/globals.css'
import { geistMono, geistSans, quicksand, saira } from '@/fonts'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${saira.variable} ${quicksand.variable} antialiased bg-background-muted`}
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    )
}
