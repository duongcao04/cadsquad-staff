import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    socialProviders: {
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID as string,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
            // Nếu bạn dùng cho doanh nghiệp (Single Tenant), thêm tenantId:
            tenantId: process.env.MICROSOFT_TENANT_ID,
        },
    },
    // Map các field của bạn nếu tên khác với mặc định của Better Auth
    user: {
        modelName: 'User',
        fields: {
            image: 'avatar', // Map 'image' từ social provider vào 'avatar' trong DB
        },
    },
})
