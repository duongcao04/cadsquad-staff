'use server'

import { NextRequest, NextResponse } from 'next/server'

import { Message } from '../abstract/message.class'
import { UserService } from './user.service'

const userService = new UserService()
const message = new Message('user')

export async function GET() {
    try {
        const data = await userService.getAll()

        return NextResponse.json({
            message: message.getAll(),
            data,
        })
    } catch (error) {
        return NextResponse.json(
            {
                message: message.error(),
                error,
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const existingEmail = await userService.isExist({ email: body.email })
        const existingUsername = await userService.isExist({
            username: body.username,
        })

        if (existingEmail || existingUsername) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        const data = await userService.create(body)
        return NextResponse.json(
            {
                message: message.created(),
                data,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
