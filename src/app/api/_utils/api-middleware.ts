import { NextRequest, NextResponse } from 'next/server'

import { publicApis } from '@/config/routeConfig'
import { removeLocaleFromPathname } from '@/i18n/routing'
import { verifyToken } from '@/lib/auth/session'

function isPublicApi(pathname: string): boolean {
    return publicApis.some((route) => pathname === route)
}

export default async function apiMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const sessionCookie = request.cookies.get('session')?.value

    if (!isPublicApi(removeLocaleFromPathname(pathname))) {
        if (!sessionCookie) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Xác thực không thành công',
                    error: 'Unauthenticated',
                },
                { status: 401 }
            )
        }
        const isCertificated = await verifyToken(sessionCookie)
        if (!isCertificated) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Xác thực không thành công',
                    error: 'Unauthenticated',
                },
                { status: 401 }
            )
        }
    }
    return NextResponse.next()
}
