import { PrismaClient } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { supabase } from '@/lib/supabase/client'

const users = [
    {
        email: 'pt.phong@cadsquad.vn',
        username: 'pt.phong',
        name: 'Phong Pham',
        avatar: 'https://ui-avatars.com/api/?name=Phong+Pham&background=random',
        jobTitle: 'Founder',
        department: 'CEO',
        phoneNumber: '+1-555-0002',
        role: 'ADMIN' as const,
    },
    {
        email: 'ch.duong@cadsquad.vn',
        username: 'ch.duong',
        name: 'Duong Cao',
        avatar: 'https://ui-avatars.com/api/?name=Duong+Cao&background=random',
        jobTitle: 'Software Developer',
        department: 'IT Deparment',
        phoneNumber: '+84-862-248-332',
        role: 'ADMIN' as const,
    },
    {
        email: 'dc.son@cadsquad.vn',
        username: 'dc.son',
        name: 'Son Dang',
        avatar: 'https://ui-avatars.com/api/?name=Son+Dang&background=random',
        jobTitle: 'Engineering',
        department: 'Engineering',
        phoneNumber: '+1-555-0003',
        role: 'USER' as const,
    },
    {
        email: 'lt.dat@cadsquad.vn',
        username: 'lt.dat',
        name: 'Dat Le',
        avatar: 'https://ui-avatars.com/api/?name=Dat+Le&background=random',
        jobTitle: 'Engineering',
        department: 'Engineering',
        phoneNumber: '+1-555-0004',
        role: 'USER' as const,
    },
    {
        email: 'nc.hieu@cadsquad.vn',
        username: 'nc.hieu',
        name: 'Hieu Nguyen',
        avatar: 'https://ui-avatars.com/api/?name=Hieu+Nguyen&background=random',
        jobTitle: 'Engineering',
        department: 'Engineering',
        phoneNumber: '+1-555-0005',
        role: 'USER' as const,
    },
    {
        email: 'nkh.minh@cadsquad.vn',
        username: 'nkh.minh',
        name: 'Minh Nguyen',
        avatar: 'https://ui-avatars.com/api/?name=Minh+Nguyen&background=random',
        jobTitle: 'Engineering',
        department: 'Engineering',
        phoneNumber: '+1-555-0006',
        role: 'USER' as const,
    },
    {
        email: 'nb.vy@cadsquad.vn',
        username: 'nb.vy',
        name: 'Vy Nguyen',
        avatar: 'https://ui-avatars.com/api/?name=Vy+Nguyen&background=random',
        jobTitle: 'Accounting',
        department: 'Accounting Deparment',
        phoneNumber: '+1-555-0007',
        role: 'ACCOUNTING' as const,
    },
]

export const seedUsers = async (prisma: PrismaClient) => {
    console.log('Seeding users...')

    const usersCreated = await Promise.all(
        users.map(async (userData) => {
            const { data: auth } = await supabase.auth.signUp({
                email: userData.email,
                password: 'cadsquaddotvn',
            })
            return prisma.user.upsert({
                where: { email: userData.email },
                update: {},
                create: { ...userData, id: auth.session?.user.id },
            })
        })
    )

    console.log(`✅ Created ${usersCreated.length} users`)
    return usersCreated
}
;(async function () {
    await seedUsers(prisma)
})()
