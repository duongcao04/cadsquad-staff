import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const PAYMENT_CHANNELS_DATA: Prisma.PaymentChannelCreateInput[] = [
	{
		displayName: 'FV.PTP',
	},
	{
		displayName: 'FV.CSD',
	},
	{
		displayName: 'CSD.PAYPAL',
	},
	{
		displayName: 'CSD.PAYONEER',
	},
	{
		displayName: 'CSD.BINANCE',
	},
	{
		displayName: 'CSD.ACB',
	},
]

export const seedPaymentChannel = async (prisma: PrismaClient) => {
	const result = await Promise.all(
		PAYMENT_CHANNELS_DATA.map((payment) => {
			return prisma.paymentChannel.create({
				data: payment,
			})
		}),
	)
	return result
}

seedPaymentChannel(prisma).then(() => {
	console.log('Seed payment channels successfully!')
})
