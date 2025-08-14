import { PrismaClient } from '@prisma/client'
import prisma from '@/lib/prisma'

const paymentChannels = [
    {
        id: 1,
        name: 'FV.PTP',
    },
    {
        id: 2,
        name: 'FV.CSD',
    },
    {
        id: 3,
        name: 'CSD.PAYPAL',
    },
    {
        id: 4,
        name: 'CSD.PAYONEER',
    },
    {
        id: 5,
        name: 'CSD.BINANCE',
    },
    {
        id: 6,
        name: 'CSD.ACB',
    },
]

export const seedPaymentChannels = async (prisma: PrismaClient) => {
    console.log('Seeding payment channels...')
    console.log('---------------------------------------')

    const paymentChannelsCreated = await Promise.all(
        paymentChannels.map((payment) => {
            console.log(payment.id, "-", payment.name);

            return prisma.paymentChannel.upsert({
                where: { id: payment.id },
                update: {},
                create: payment,
            })
        }
        )
    )

    console.log('---------------------------------------')
    console.log(`✅ Created ${paymentChannelsCreated.length} payment channels`)
    return paymentChannelsCreated
}

seedPaymentChannels(prisma)
