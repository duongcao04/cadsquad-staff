'use server'

import { compare, hash } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

import envConfig from '@/config/envConfig'
import { constants } from '@/shared/constants'
import { User } from '@/shared/interfaces/user.interface'

const key = new TextEncoder().encode(envConfig.NEXT_PUBLIC_SUPABASE_JWT_KEY)
const SALT_ROUNDS = 10

export async function hashPassword(password: string) {
    return hash(password, SALT_ROUNDS)
}

export async function comparePasswords(
    plainTextPassword: string,
    hashedPassword: string
) {
    return compare(plainTextPassword, hashedPassword)
}

type SessionData = {
    user: { id: string; role: string; iat: string }
    expires: string
}

export async function signToken(payload: SessionData) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1 day from now')
        .sign(key)
}

export async function verifyToken(input: string) {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    })
    return payload as SessionData
}

export async function getSession() {
    const session = (await cookies()).get('session')?.value
    if (!session) return null
    return await verifyToken(session)
}

export async function setSession(user: User, expiresAt?: number) {
    const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day from now
    const expires = expiresAt ? new Date(expiresAt) : expiresInOneDay
    const session: SessionData = {
        user: {
            id: user.id!.toString(),
            role: user.role!,
            iat: Date.now().toString(),
        },
        expires: expires.toISOString(),
    }
    const encryptedSession = await signToken(session)
    return (await cookies()).set('session', encryptedSession, {
        expires: expiresInOneDay,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
    })
}

type CustomSessionData = {
    name: string
    value: string
    expiresAt: string
}
export async function setCustomSession({
    name,
    value,
    expiresAt,
}: CustomSessionData) {
    let expires = new Date(Date.now() + constants.ms.day[1])

    if (expiresAt) {
        expires = new Date(expiresAt)
    }
    try {
        return (await cookies()).set(name, JSON.stringify(value), {
            expires,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
        })
    } catch (error) {
        console.log(error)
    }
}

export async function logoutSession(user: User) {
    const session: SessionData = {
        user: {
            id: user.id!.toString(),
            role: user.role!,
            iat: Date.now().toString(),
        },
        expires: new Date(Date.now()).toISOString(),
    }
    const encryptedSession = await signToken(session)
        ; (await cookies()).set('session', encryptedSession, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
        })
}

// TODO: add refresh token for expand work session
