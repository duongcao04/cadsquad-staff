import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '../../../../lib/prisma'

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { email, password } = body

    try {
        // 1. Create supabase instance
        const supabase = await createClient()
        // 2. Authentication user with supabase
        const { session } = await supabase.auth
            .signInWithPassword({
                email: email,
                password: password,
            })
            .then((res) => {
                return res.data
            })

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Đăng nhập thất bại',
                    error: 'Unauthenticated',
                },
                { status: 401 }
            )
        }

        // 3. Return token
        const result = {
            accessToken: session?.access_token,
            expiresIn: session?.expires_in,
            expiresAt: session?.expires_at,
            refreshToken: session?.refresh_token,
        }

        // updateLastLoginAt
        await prisma.user.update({
            where: { uuid: session.user.id },
            data: {
                lastLoginAt: new Date().toISOString(),
            },
        })

        return NextResponse.json(
            { success: true, message: 'Đăng nhập thành công', result },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error creating file system:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Đăng nhập thất bại',
                error: 'Unauthenticated',
            },
            { status: 401 }
        )
    }
}
