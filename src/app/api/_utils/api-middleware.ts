import { NextRequest, NextResponse } from 'next/server'

import { publicApis } from '@/config/routeConfig'
import { removeLocaleFromPathname } from '@/i18n/routing'
import { verifyToken } from '@/lib/auth/session'

function isPublicApi(pathname: string): boolean {
    return publicApis.some((route) => pathname === route)
}

export default async function apiMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    // 1. Get token from cookie
    const sessionCookie = request.cookies.get('session')?.value
    // 2. If not found token on Cookie -> use token from Header
    const token =
        sessionCookie ?? request.headers.get('Authorization')?.split(' ')[1]

    if (!isPublicApi(removeLocaleFromPathname(pathname))) {
        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Xác thực không thành công',
                    error: 'Unauthenticated',
                },
                { status: 401 }
            )
        }
        const isCertificated = await verifyToken(token)
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
