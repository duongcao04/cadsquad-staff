import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const supabase = createClient()
        // 1. Get user from Supabase Auth
        const { claims: user } = await (await supabase).auth.getClaims().then(res => res.data!)
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Lấy thông tin tài khoản thất bại',
                    error: "Unauthenticated"
                },
                { status: 401 }
            )
        }
        // 2. Match user on Supabase Auth and Prisma Database with UUID field
        const result = await prisma.user.findUnique({ where: { uuid: user.sub } })
        return NextResponse.json(
            {
                success: true,
                message: 'Lấy thông tin tài khoản thành công',
                result
            },
            { status: 200 }
        )
    } catch (error) {
        console.log('Get user failed:::', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Lấy thông tin tài khoản thất bại',
                error: "Unauthenticated"
            },
            { status: 401 }
        )
    }
}
