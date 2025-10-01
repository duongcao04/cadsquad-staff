import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const PAYMENT_CHANNELS_DATA: Prisma.PaymentChannelCreateInput[] = [
	{
		id: '2f8a5a4d-6c4e-4f90-8f64-94bde3acbd2d',
		displayName: 'FV.PTP',
	},
	{
		id: 'c9f134a5-3a72-42e1-b9fa-4f2b3b2b85a9',
		displayName: 'FV.CSD',
	},
	{
		id: '4e6c64c7-08fb-46df-83aa-49c2bb91f9db',
		displayName: 'CSD.PAYPAL',
	},
	{
		id: '7f2e2b76-16e0-4e0c-83b7-91a924f1ef62',
		displayName: 'CSD.PAYONEER',
	},
	{
		id: '5b7d2d1f-2c9a-4f4b-a38d-7fbb3f0797d6',
		displayName: 'CSD.BINANCE',
	},
	{
		id: 'a18d5a9b-d067-493f-a7d7-2fb6b31d54de',
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
