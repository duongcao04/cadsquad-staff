import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const supabase = createClient()
        const { user } = await (await supabase).auth.getUser().then(res => res.data)
        console.log(user?.id);

        const result = await prisma.user.findUnique({ where: { id: user?.id } })

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
            { status: 500 }
        )
    }
}
