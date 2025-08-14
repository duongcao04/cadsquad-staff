import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/session";
import { removeLocaleFromPathname } from "@/i18n/routing";

export const publicApi = ['/api/auth/login']

function isPublicApi(pathname: string): boolean {
	return publicApi.some(
		(route) =>
			pathname === route
	)
}
export default async function apiMiddleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const sessionCookie = request.cookies.get('session')?.value

	if (!isPublicApi(removeLocaleFromPathname(pathname))) {
		if (!sessionCookie) {
			return NextResponse.json({
				success: false,
				message: "Xác thực không thành công",
				error: "Unauthenticated"
			}, { status: 401 })
		}
		const isCertificated = await verifyToken(sessionCookie)
		if (!isCertificated) {
			return NextResponse.json({
				success: false,
				message: "Xác thực không thành công",
				error: "Unauthenticated"
			}, { status: 401 })
		}
	}
	return NextResponse.next()
}